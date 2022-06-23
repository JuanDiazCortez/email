const {
  URL_DATABASE,
  PORT_BACKEND,
  Status,
  onRetrieveUrl,
  // printMail
} = require("../constants");

export const onListFilter = (
  ev,
  setFilterText,
  setFilterOption,
  data,
  setFilterList
) => {
  console.log(`changeFilter ${ev}`);
  /* cada vez que cambia el modo de busqueda
        limpiar input */
  setFilterText("");

  setFilterOption(ev);

  switch (ev) {
    case "origen":
      let result = [];
      data.map((mail) => {
        return mail.from.forEach((element) => {
          if (result.indexOf(element.address) === -1) {
            result.push(element.address);
          }
        });
      });
      setFilterList(result);
      break;

    default:
      break;
  }
};

/* export const handleNavigation = (e) => {
  // console.log("handle scroll");
  const window = e.currentTarget;
  if (y > window.scrollY) {
    //  console.log("scrolling up");
  } else if (y < window.scrollY) {
    //   console.log("scrolling down");
  }
  setY(window.scrollY);
  //    console.log(window.scrollY);
  if (window.scrollY > 162) {
    // let t = document.getElementById("side-toolbar");
    // let offset = t.offsetTop;
    // // let w = $(window);
    // let x = offset.left;
    // t.css("left", x + 50);
  }
  let n = new DOMRect(t.x, t.y - window.scrollY, t.width, t.height);
    document.getElementById("side-toolbar").setBoundingClientRect = n; 
}; */

export const processChange = (
  content,
  ev,
  mail,
  data,
  setData,
  newMail,
  setChangeFlag
) => {
  if (ev) {
    console.log(ev);
  } else {
    return console.log("no evento");
  }

  console.log(`status ${ev.target.value}`);
  if (ev.target.value === "leido") {
    console.log(ev.nativeEvent.path);
    // return renderChanged(ev.nativeEvent.path[3], mail);
    uPdateGlobalData(newMail, data, setData);
    setChangeFlag(true);
  }
  let newState = Status[ev.target.value].key;
  console.log(`new=${newState}`);
  if (!newState) {
    newState = Status.normal.key;
  }
  console.log(content.result.length);

  console.log(`${JSON.stringify(content.result[1], null, 2)}`);
  let newList = data.map((item) => {
    if (item.messageId === mail.messageId) {
      let l = item.leido;
      const updateItem = {
        ...item,
        state: newState,
        leido: ev.target.value === "leido" ? !l : l,
      };
      return updateItem;
    }
    return item;
  });
  setData(newList);
};

const uPdateGlobalData = (newEmail, data, setData) => {
  let newList = data.map((item) => {
    if (item.messageId === newEmail.messageId) {
      const updateItem = {
        ...item,
        state: newEmail.state,
        leido: newEmail.leido,
      };
      return updateItem;
    }
    return item;
  });
  setData(newList);
};

export const updateReenviado = (user, credenciales, setData, data, email) => {
  console.log(`update Reenviado ${JSON.stringify(user)}`);
  console.log(`change data ${JSON.stringify(email.messageId)}`);
  onRetrieveUrl(
    `http://${URL_DATABASE}:${PORT_BACKEND}/changeStatus`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_generador: credenciales.id,
        id: user.id, // mail
        newStatus: "reenviado",
        leido: user.leido,
        mail: user.id,
        to_id: user.toUser.id,
      }),
    },
    (respuesta) => {
      console.log(`onRetrieveUrl ->respuesta ${respuesta}`);
    }
  );

  let newList = [];
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    console.log(`index:${index}`);
    if (element) {
      if (element.messageId === email.messageId) {
        let newState = Status["reenviado"].key;

        const updateItem = {
          ...element,
          state: newState,
          leido: true,
          reenviado: user.toUser,
        };
        newList.push(updateItem);
      } else newList.push(element);
    } else {
      console.log(`NULL ${index}`);
    }
  }
  setData(newList);
  /*
  data.map((element, index) => {
    console.log(`index:${index}`);
    if (element.messageId === user.id) {
      let newState = Status["reenviado"].key;

      const updateItem = {
        ...element,
        state: newState,
        leido: true,
        reenviado: user.toUser,
      };
      return updateItem;
    }
    return element;
  });

  setData(newList);
  */
};
