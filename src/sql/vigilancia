--
-- PostgreSQL database dump
--

-- Dumped from database version 13.5
-- Dumped by pg_dump version 13.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'LATIN1';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: webinfo; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA webinfo;


ALTER SCHEMA webinfo OWNER TO postgres;

--
-- Name: updateaemils(jsonb); Type: FUNCTION; Schema: webinfo; Owner: postgres
--

CREATE FUNCTION webinfo.updateaemils(mail jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
    /* variables de v_1 */
DECLARE
    DECLARE v_messageid character varying(180);
    
    /* variable de boletindbf */
BEGIN    
INSERT INTO emails(mail)
SELECT  mail
WHERE
    NOT EXISTS (
        SELECT id FROM webinfo.email WHERE mail->>'messageId' = mail->'messageId'
    );

    RETURN;
END;
$$;


ALTER FUNCTION webinfo.updateaemils(mail jsonb) OWNER TO postgres;

--
-- Name: updateamil(jsonb); Type: FUNCTION; Schema: webinfo; Owner: postgres
--

CREATE FUNCTION webinfo.updateamil(mail jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
    /* variables de v_1 */
DECLARE
    DECLARE v_messageid character varying(180);
    
    /* variable de boletindbf */
BEGIN    
INSERT INTO emails(mail)
SELECT  mail
WHERE
    NOT EXISTS (
        SELECT id FROM webinfo.emails  WHERE mail->>'messageId' = v_messageid
    );

    RETURN;
END;
$$;


ALTER FUNCTION webinfo.updateamil(mail jsonb) OWNER TO postgres;

--
-- Name: updateemails(jsonb); Type: FUNCTION; Schema: webinfo; Owner: postgres
--

CREATE FUNCTION webinfo.updateemails(email jsonb) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
        /* variables de v_1 */
    
        DECLARE lexists integer = 0 ;
        DECLARE v_mail alias FOR $1;
        DECLARE v_id  text = email->>'messageId';
        DECLARE vcursor CURSOR FOR
            SELECT
                count(*)
            FROM
                webinfo.emails
            WHERE
                 webinfo.emails.mail->>'messageId' = v_id;
    BEGIN
        RAISE info 'buscando %', v_id;
        OPEN vcursor;
        FETCH vcursor INTO lexists;
        CLOSE vcursor;
        RAISE info 'buscando  messageId=% found=%  lexists=%', v_id, FOUND,lexists ;
        IF lexists != 0  THEN
            RAISE info 'FOUND estaba' ;
            RETURN false;
        ELSE
        RAISE info 'INSERT' ;    
            
                INSERT INTO webinfo.emails (mail)
                    VALUES ($1);
           
            return true;
        END IF;
    END;
    $_$;


ALTER FUNCTION webinfo.updateemails(email jsonb) OWNER TO postgres;

--
-- Name: updateenviado(integer, integer, character varying, character varying); Type: FUNCTION; Schema: webinfo; Owner: postgres
--

CREATE FUNCTION webinfo.updateenviado(id_generator integer, touser integer, idrow character varying, estado character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$ 
    DECLARE 
    BEGIN 
        UPDATE richelet.webinfo.mailstatus SET id_user = id_generator, id_user_to = touser , status=estado  WHERE idmail = idRow and id_user=id_generator ; 
        IF NOT FOUND THEN 
        INSERT INTO mailstatus(id_user,id_user_to,idmail,status)  values (id_generator,touser,idRow, estado); 
        END IF; 
    END; 
    $$;


ALTER FUNCTION webinfo.updateenviado(id_generator integer, touser integer, idrow character varying, estado character varying) OWNER TO postgres;

--
-- Name: updateleido(integer, character varying, boolean); Type: FUNCTION; Schema: webinfo; Owner: postgres
--

CREATE FUNCTION webinfo.updateleido(id_generator integer, idrow character varying, estado boolean) RETURNS void
    LANGUAGE plpgsql
    AS $$ 
    DECLARE 
    BEGIN 
        UPDATE richelet.webinfo.mailstatus SET leido = estado , id_user=id_generator WHERE idmail = idRow ; 
        IF NOT FOUND THEN 
        INSERT INTO mailstatus(id_user,idmail,leido)  values (id_generator,idRow, estado  ); 
        END IF; 
    END; 
    $$;


ALTER FUNCTION webinfo.updateleido(id_generator integer, idrow character varying, estado boolean) OWNER TO postgres;

--
-- Name: updatestatus(integer, character varying, character varying); Type: FUNCTION; Schema: webinfo; Owner: postgres
--

CREATE FUNCTION webinfo.updatestatus(id_generator integer, idrow character varying, estado character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$ 
    DECLARE 
    BEGIN 
        UPDATE richelet.webinfo.mailstatus SET status = estado , id_user=id_generator   WHERE idmail = idRow and id_user = id_generator ; 
        IF NOT FOUND THEN 
        INSERT INTO mailstatus(id_user,idmail,status )  values (id_generator,idRow, estado); 
        END IF; 
    END; 
    $$;


ALTER FUNCTION webinfo.updatestatus(id_generator integer, idrow character varying, estado character varying) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: emails; Type: TABLE; Schema: webinfo; Owner: postgres
--

CREATE TABLE webinfo.emails (
    id integer NOT NULL,
    mail jsonb
);


ALTER TABLE webinfo.emails OWNER TO postgres;

--
-- Name: emails_id_seq; Type: SEQUENCE; Schema: webinfo; Owner: postgres
--

CREATE SEQUENCE webinfo.emails_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE webinfo.emails_id_seq OWNER TO postgres;

--
-- Name: emails_id_seq; Type: SEQUENCE OWNED BY; Schema: webinfo; Owner: postgres
--

ALTER SEQUENCE webinfo.emails_id_seq OWNED BY webinfo.emails.id;


--
-- Name: emails_update; Type: TABLE; Schema: webinfo; Owner: postgres
--

CREATE TABLE webinfo.emails_update (
    id integer,
    mail jsonb
);


ALTER TABLE webinfo.emails_update OWNER TO postgres;

--
-- Name: mails_back; Type: TABLE; Schema: webinfo; Owner: postgres
--

CREATE TABLE webinfo.mails_back (
    id integer,
    mail jsonb
);


ALTER TABLE webinfo.mails_back OWNER TO postgres;

--
-- Name: mailspam; Type: TABLE; Schema: webinfo; Owner: postgres
--

CREATE TABLE webinfo.mailspam (
    id integer NOT NULL,
    idmail character varying(40)
);


ALTER TABLE webinfo.mailspam OWNER TO postgres;

--
-- Name: mailspam_id_seq; Type: SEQUENCE; Schema: webinfo; Owner: postgres
--

CREATE SEQUENCE webinfo.mailspam_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE webinfo.mailspam_id_seq OWNER TO postgres;

--
-- Name: mailspam_id_seq; Type: SEQUENCE OWNED BY; Schema: webinfo; Owner: postgres
--

ALTER SEQUENCE webinfo.mailspam_id_seq OWNED BY webinfo.mailspam.id;


--
-- Name: mailstatus; Type: TABLE; Schema: webinfo; Owner: postgres
--

CREATE TABLE webinfo.mailstatus (
    id integer NOT NULL,
    idmail character varying(120),
    status character varying(12) DEFAULT 'normal'::character varying,
    leido boolean DEFAULT false,
    id_user integer DEFAULT 0 NOT NULL,
    id_user_to integer,
    lastdate timestamp with time zone DEFAULT now()
);


ALTER TABLE webinfo.mailstatus OWNER TO postgres;

--
-- Name: mailstatus_id_seq; Type: SEQUENCE; Schema: webinfo; Owner: postgres
--

CREATE SEQUENCE webinfo.mailstatus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE webinfo.mailstatus_id_seq OWNER TO postgres;

--
-- Name: mailstatus_id_seq; Type: SEQUENCE OWNED BY; Schema: webinfo; Owner: postgres
--

ALTER SEQUENCE webinfo.mailstatus_id_seq OWNED BY webinfo.mailstatus.id;


--
-- Name: pepe; Type: SEQUENCE; Schema: webinfo; Owner: postgres
--

CREATE SEQUENCE webinfo.pepe
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE webinfo.pepe OWNER TO postgres;

--
-- Name: prefs; Type: TABLE; Schema: webinfo; Owner: postgres
--

CREATE TABLE webinfo.prefs (
    id integer NOT NULL,
    id_user integer NOT NULL,
    data jsonb
);


ALTER TABLE webinfo.prefs OWNER TO postgres;

--
-- Name: prefs_id_seq; Type: SEQUENCE; Schema: webinfo; Owner: postgres
--

CREATE SEQUENCE webinfo.prefs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE webinfo.prefs_id_seq OWNER TO postgres;

--
-- Name: prefs_id_seq; Type: SEQUENCE OWNED BY; Schema: webinfo; Owner: postgres
--

ALTER SEQUENCE webinfo.prefs_id_seq OWNED BY webinfo.prefs.id;


--
-- Name: users; Type: TABLE; Schema: webinfo; Owner: postgres
--

CREATE TABLE webinfo.users (
    id integer NOT NULL,
    email character varying(40),
    usuario character varying(20),
    nombre character varying(40),
    apellido character varying(40),
    doc character varying(20),
    passwd text,
    p2 text,
    lastlogin timestamp with time zone DEFAULT now(),
    hash text DEFAULT gen_random_uuid(),
    admin boolean DEFAULT false
);


ALTER TABLE webinfo.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: webinfo; Owner: postgres
--

CREATE SEQUENCE webinfo.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE webinfo.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: webinfo; Owner: postgres
--

ALTER SEQUENCE webinfo.users_id_seq OWNED BY webinfo.users.id;


--
-- Name: emails id; Type: DEFAULT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.emails ALTER COLUMN id SET DEFAULT nextval('webinfo.emails_id_seq'::regclass);


--
-- Name: mailspam id; Type: DEFAULT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.mailspam ALTER COLUMN id SET DEFAULT nextval('webinfo.mailspam_id_seq'::regclass);


--
-- Name: mailstatus id; Type: DEFAULT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.mailstatus ALTER COLUMN id SET DEFAULT nextval('webinfo.mailstatus_id_seq'::regclass);


--
-- Name: prefs id; Type: DEFAULT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.prefs ALTER COLUMN id SET DEFAULT nextval('webinfo.prefs_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.users ALTER COLUMN id SET DEFAULT nextval('webinfo.users_id_seq'::regclass);


--
-- Name: emails emails_pkey; Type: CONSTRAINT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.emails
    ADD CONSTRAINT emails_pkey PRIMARY KEY (id);


--
-- Name: mailspam mailspam_pkey; Type: CONSTRAINT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.mailspam
    ADD CONSTRAINT mailspam_pkey PRIMARY KEY (id);


--
-- Name: mailstatus mailstatus_pkey; Type: CONSTRAINT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.mailstatus
    ADD CONSTRAINT mailstatus_pkey PRIMARY KEY (id);


--
-- Name: prefs prefs_pkey; Type: CONSTRAINT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.prefs
    ADD CONSTRAINT prefs_pkey PRIMARY KEY (id_user);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: i_seacrch; Type: INDEX; Schema: webinfo; Owner: postgres
--

CREATE INDEX i_seacrch ON webinfo.emails_update USING btree (((mail ->> 'messageId'::text)));


--
-- Name: i_x_messageid; Type: INDEX; Schema: webinfo; Owner: postgres
--

CREATE INDEX i_x_messageid ON webinfo.emails USING btree (((mail ->> 'messageId'::text)));


--
-- PostgreSQL database dump complete
--

