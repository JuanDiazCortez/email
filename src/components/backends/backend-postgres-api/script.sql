--
-- PostgreSQL database dump
--

-- Dumped from database version 13.5
-- Dumped by pg_dump version 13.5

-- Started on 2021-12-14 09:35:42 -03

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
-- TOC entry 6 (class 2615 OID 17526)
-- Name: webinfo; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA webinfo;


ALTER SCHEMA webinfo OWNER TO postgres;

--
-- TOC entry 385 (class 1255 OID 26031)
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
-- TOC entry 383 (class 1255 OID 26030)
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
-- TOC entry 384 (class 1255 OID 26034)
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
-- TOC entry 267 (class 1259 OID 26091)
-- Name: emails; Type: TABLE; Schema: webinfo; Owner: postgres
--

CREATE TABLE webinfo.emails (
    id integer NOT NULL,
    mail jsonb
);


ALTER TABLE webinfo.emails OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 26089)
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
-- TOC entry 3348 (class 0 OID 0)
-- Dependencies: 266
-- Name: emails_id_seq; Type: SEQUENCE OWNED BY; Schema: webinfo; Owner: postgres
--

ALTER SEQUENCE webinfo.emails_id_seq OWNED BY webinfo.emails.id;


--
-- TOC entry 259 (class 1259 OID 17545)
-- Name: mailspam; Type: TABLE; Schema: webinfo; Owner: postgres
--

CREATE TABLE webinfo.mailspam (
    id integer NOT NULL,
    idmail character varying(40)
);


ALTER TABLE webinfo.mailspam OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 17543)
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
-- TOC entry 3349 (class 0 OID 0)
-- Dependencies: 258
-- Name: mailspam_id_seq; Type: SEQUENCE OWNED BY; Schema: webinfo; Owner: postgres
--

ALTER SEQUENCE webinfo.mailspam_id_seq OWNED BY webinfo.mailspam.id;


--
-- TOC entry 257 (class 1259 OID 17537)
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
-- TOC entry 256 (class 1259 OID 17535)
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
-- TOC entry 3350 (class 0 OID 0)
-- Dependencies: 256
-- Name: mailstatus_id_seq; Type: SEQUENCE OWNED BY; Schema: webinfo; Owner: postgres
--

ALTER SEQUENCE webinfo.mailstatus_id_seq OWNED BY webinfo.mailstatus.id;


--
-- TOC entry 265 (class 1259 OID 26080)
-- Name: prefs; Type: TABLE; Schema: webinfo; Owner: postgres
--

CREATE TABLE webinfo.prefs (
    id integer NOT NULL,
    id_user integer NOT NULL,
    data jsonb
);


ALTER TABLE webinfo.prefs OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 26078)
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
-- TOC entry 3351 (class 0 OID 0)
-- Dependencies: 264
-- Name: prefs_id_seq; Type: SEQUENCE OWNED BY; Schema: webinfo; Owner: postgres
--

ALTER SEQUENCE webinfo.prefs_id_seq OWNED BY webinfo.prefs.id;


--
-- TOC entry 263 (class 1259 OID 25887)
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
-- TOC entry 262 (class 1259 OID 25885)
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
-- TOC entry 3352 (class 0 OID 0)
-- Dependencies: 262
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: webinfo; Owner: postgres
--

ALTER SEQUENCE webinfo.users_id_seq OWNED BY webinfo.users.id;


--
-- TOC entry 3196 (class 2604 OID 26094)
-- Name: emails id; Type: DEFAULT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.emails ALTER COLUMN id SET DEFAULT nextval('webinfo.emails_id_seq'::regclass);


--
-- TOC entry 3190 (class 2604 OID 17548)
-- Name: mailspam id; Type: DEFAULT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.mailspam ALTER COLUMN id SET DEFAULT nextval('webinfo.mailspam_id_seq'::regclass);


--
-- TOC entry 3185 (class 2604 OID 17540)
-- Name: mailstatus id; Type: DEFAULT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.mailstatus ALTER COLUMN id SET DEFAULT nextval('webinfo.mailstatus_id_seq'::regclass);


--
-- TOC entry 3195 (class 2604 OID 26083)
-- Name: prefs id; Type: DEFAULT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.prefs ALTER COLUMN id SET DEFAULT nextval('webinfo.prefs_id_seq'::regclass);


--
-- TOC entry 3191 (class 2604 OID 25890)
-- Name: users id; Type: DEFAULT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.users ALTER COLUMN id SET DEFAULT nextval('webinfo.users_id_seq'::regclass);


--
-- TOC entry 3206 (class 2606 OID 26099)
-- Name: emails emails_pkey; Type: CONSTRAINT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.emails
    ADD CONSTRAINT emails_pkey PRIMARY KEY (id);


--
-- TOC entry 3200 (class 2606 OID 17550)
-- Name: mailspam mailspam_pkey; Type: CONSTRAINT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.mailspam
    ADD CONSTRAINT mailspam_pkey PRIMARY KEY (id);


--
-- TOC entry 3198 (class 2606 OID 17542)
-- Name: mailstatus mailstatus_pkey; Type: CONSTRAINT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.mailstatus
    ADD CONSTRAINT mailstatus_pkey PRIMARY KEY (id);


--
-- TOC entry 3204 (class 2606 OID 26088)
-- Name: prefs prefs_pkey; Type: CONSTRAINT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.prefs
    ADD CONSTRAINT prefs_pkey PRIMARY KEY (id_user);


--
-- TOC entry 3202 (class 2606 OID 25892)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: webinfo; Owner: postgres
--

ALTER TABLE ONLY webinfo.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Completed on 2021-12-14 09:35:42 -03

--
-- PostgreSQL database dump complete
--

