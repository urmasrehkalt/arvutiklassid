--
-- PostgreSQL database dump
--

\restrict OdH0KLRTPDyc1Pjvp1xcSd7UF6hNHte2Jels5nXuL5LbBtkqcYjWyUSppKkgQ4O

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: booking; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.booking (
    id integer NOT NULL,
    classroom_id integer NOT NULL,
    user_id integer NOT NULL,
    lesson_type_id integer,
    booking_date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    participants integer DEFAULT 0 NOT NULL,
    description character varying(255),
    CONSTRAINT booking_participants_check CHECK ((participants >= 0)),
    CONSTRAINT chk_time_range CHECK ((end_time > start_time))
);


ALTER TABLE public.booking OWNER TO admin;

--
-- Name: booking_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.booking_id_seq OWNER TO admin;

--
-- Name: booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.booking_id_seq OWNED BY public.booking.id;


--
-- Name: classroom; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.classroom (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    building character varying(100) NOT NULL,
    floor integer NOT NULL,
    capacity integer NOT NULL,
    has_projector boolean DEFAULT false NOT NULL,
    CONSTRAINT classroom_capacity_check CHECK ((capacity > 0))
);


ALTER TABLE public.classroom OWNER TO admin;

--
-- Name: classroom_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.classroom_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.classroom_id_seq OWNER TO admin;

--
-- Name: classroom_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.classroom_id_seq OWNED BY public.classroom.id;


--
-- Name: lesson_type; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.lesson_type (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.lesson_type OWNER TO admin;

--
-- Name: lesson_type_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.lesson_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lesson_type_id_seq OWNER TO admin;

--
-- Name: lesson_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.lesson_type_id_seq OWNED BY public.lesson_type.id;


--
-- Name: user_or_group; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_or_group (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150),
    role character varying(20) NOT NULL,
    CONSTRAINT user_or_group_role_check CHECK (((role)::text = ANY ((ARRAY['teacher'::character varying, 'group'::character varying])::text[])))
);


ALTER TABLE public.user_or_group OWNER TO admin;

--
-- Name: user_or_group_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.user_or_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_or_group_id_seq OWNER TO admin;

--
-- Name: user_or_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.user_or_group_id_seq OWNED BY public.user_or_group.id;


--
-- Name: booking id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking ALTER COLUMN id SET DEFAULT nextval('public.booking_id_seq'::regclass);


--
-- Name: classroom id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.classroom ALTER COLUMN id SET DEFAULT nextval('public.classroom_id_seq'::regclass);


--
-- Name: lesson_type id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.lesson_type ALTER COLUMN id SET DEFAULT nextval('public.lesson_type_id_seq'::regclass);


--
-- Name: user_or_group id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_or_group ALTER COLUMN id SET DEFAULT nextval('public.user_or_group_id_seq'::regclass);


--
-- Data for Name: booking; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.booking (id, classroom_id, user_id, lesson_type_id, booking_date, start_time, end_time, participants, description) FROM stdin;
1	1	1	1	2026-02-09	08:00:00	09:30:00	28	Programmeerimise loeng
2	1	4	2	2026-02-09	10:00:00	11:30:00	25	Veebiarenduse praktikum
3	2	2	2	2026-02-09	12:00:00	13:30:00	22	Andmebaaside praktikum
4	3	3	1	2026-02-10	08:00:00	09:30:00	18	IT-aluste loeng
5	4	1	2	2026-02-10	10:00:00	13:00:00	30	Tarkvaraarenduse praktikum
6	5	5	3	2026-02-11	14:00:00	15:30:00	12	Projekti seminar
7	6	2	1	2026-02-11	08:00:00	11:00:00	38	Programmeerimise loeng
8	1	6	2	2026-02-12	10:00:00	11:30:00	20	Arvutivõrkude praktikum
9	2	3	4	2026-02-12	12:00:00	14:00:00	24	Andmebaaside eksam
10	4	1	5	2026-02-13	10:00:00	11:00:00	5	Konsultatsioon
11	3	4	2	2026-02-13	08:00:00	09:30:00	19	Veebiarenduse praktikum
12	6	2	1	2026-02-13	12:00:00	13:30:00	35	IT-aluste loeng
\.


--
-- Data for Name: classroom; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.classroom (id, name, building, floor, capacity, has_projector) FROM stdin;
1	A201	A-korpus	2	30	t
2	A202	A-korpus	2	25	t
3	B101	B-korpus	1	20	f
4	B305	B-korpus	3	35	t
5	C110	C-korpus	1	15	t
6	C215	C-korpus	2	40	t
\.


--
-- Data for Name: lesson_type; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.lesson_type (id, name) FROM stdin;
1	Loeng
2	Praktikum
3	Seminar
4	Eksam
5	Konsultatsioon
\.


--
-- Data for Name: user_or_group; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_or_group (id, name, email, role) FROM stdin;
1	Mart Tamm	mart.tamm@kool.ee	teacher
2	Liis Kask	liis.kask@kool.ee	teacher
3	Andres Mägi	andres.magi@kool.ee	teacher
4	TAK25	\N	group
5	TAK24	\N	group
6	TARpe24	\N	group
\.


--
-- Name: booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.booking_id_seq', 12, true);


--
-- Name: classroom_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.classroom_id_seq', 6, true);


--
-- Name: lesson_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.lesson_type_id_seq', 5, true);


--
-- Name: user_or_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.user_or_group_id_seq', 6, true);


--
-- Name: booking booking_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_pkey PRIMARY KEY (id);


--
-- Name: classroom classroom_name_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.classroom
    ADD CONSTRAINT classroom_name_key UNIQUE (name);


--
-- Name: classroom classroom_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.classroom
    ADD CONSTRAINT classroom_pkey PRIMARY KEY (id);


--
-- Name: lesson_type lesson_type_name_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.lesson_type
    ADD CONSTRAINT lesson_type_name_key UNIQUE (name);


--
-- Name: lesson_type lesson_type_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.lesson_type
    ADD CONSTRAINT lesson_type_pkey PRIMARY KEY (id);


--
-- Name: user_or_group user_or_group_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_or_group
    ADD CONSTRAINT user_or_group_pkey PRIMARY KEY (id);


--
-- Name: idx_booking_classroom; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_booking_classroom ON public.booking USING btree (classroom_id);


--
-- Name: idx_booking_date; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_booking_date ON public.booking USING btree (booking_date);


--
-- Name: idx_booking_user; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX idx_booking_user ON public.booking USING btree (user_id);


--
-- Name: booking booking_classroom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_classroom_id_fkey FOREIGN KEY (classroom_id) REFERENCES public.classroom(id) ON DELETE CASCADE;


--
-- Name: booking booking_lesson_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_lesson_type_id_fkey FOREIGN KEY (lesson_type_id) REFERENCES public.lesson_type(id) ON DELETE SET NULL;


--
-- Name: booking booking_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_or_group(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict OdH0KLRTPDyc1Pjvp1xcSd7UF6hNHte2Jels5nXuL5LbBtkqcYjWyUSppKkgQ4O

