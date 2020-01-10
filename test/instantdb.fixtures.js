function instantDB() {
  return `
  

--
-- Data for Name: category_list; Type: TABLE DATA; Schema: public; Owner: nanosh
--

COPY public.category_list (id, list_owner, list_name) FROM stdin;
2	2	dragon stuff
4	2	inter-dimensional time cannons
5	2	socks
6	7	super-secret falcons
7	3	mystery-fish
8	5	panda food
3	2	other stuff
1000	2	Putin's list isnt' sdfs
1042	2	this is a new list
1	2	Sith Cloaks
1043	2	a better name for a list
1046	2	this is a list
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: nanosh
--

COPY public.inventory (id, item_name, item_body, item_owner, item_is, item_list) FROM stdin;
1003	Putin's item name		2	unavailable	1000
1004	Putin's item name 2	another thing sold by putin hi	2	selling	1000
1005	A new item made by clicking	the body\n	2	unavailable	1000
5	all the things	basically free isn't it	2	selling	1
1043	please name your item	\N	2	unavailable	1043
1	maltese falcon		7	selling	6
2	milenium falcon	for parts	5	selling	8
3	cup of soup	last one	2	selling	2
4	vintage computer	further discounted	2	selling	5
1006	pleme your item	\N	2	unavailable	5
1000	Putin's item name 	\N	2	unavailable	1000
1038	please name ysdfsfour item	\N	2	unavailable	3
1039	millinium falcon	a pile of pancakes	2	unavailable	1042
1041	All the things	Do you want all the things? Do you want all the things? Do you want all the things? Do you want all the things? Do you want all the things? Do you want all the things? Do you want all the things? Do you want all the things? Do you want all the things? Do you want all the things? Do you want all the things? Do you want all the things? Do you want all the things? Do you want all the things? Do you want all the things? 	2	selling	1
\.


--
-- Data for Name: morkit_user; Type: TABLE DATA; Schema: public; Owner: nanosh
--

COPY public.morkit_user (id, username, since, pass, fullname, about) FROM stdin;
7	Matt	2020-01-02 22:19:36.870366	passwordMat	Kylo Ren	A Sith
2	Putin	2020-01-02 22:19:36.870366	passwordPut	Donald J trump	Best President in the history of America, many people have said, many people have said, not just regular people, important people, many important people on both sides.
1	Vermin	2020-01-02 22:19:36.870366	passwordVer	Franz Kafka	A human
4	RobertGalbraith	2020-01-02 22:19:36.870366	passwordRob	J K Rowling	A human
3	Mr Pants	2020-01-02 22:19:36.870366	passwordMrP	Sponge Bob Squarepants	A Sponge with pants
5	Gary	2020-01-02 22:19:36.870366	passwordGar	Gary	A sea slug
6	Horatio	2020-01-02 22:19:36.870366	passwordHor	Horty Nortatio	Another human
\.


--
-- Data for Name: msg; Type: TABLE DATA; Schema: public; Owner: nanosh
--

COPY public.msg (id, sender_id, receiver_id, item_id, send_time, content, buy, check_available, rsp_buy, rsp_time, rsp_check, rsp_both, rsp_content) FROM stdin;
2	7	2	3	2020-01-02 22:19:36.870366	Yo	t	f	\N	\N	\N	\N	\N
3	6	7	1	2020-01-02 22:19:36.870366	Sup	f	t	\N	\N	\N	\N	\N
4	3	2	4	2020-01-02 22:19:36.870366	hi	t	t	\N	\N	\N	\N	\N
5	1	2	4	2020-01-02 22:19:36.870366	I want that	t	f	\N	\N	\N	\N	\N
1000	2	5	2	2020-01-03 18:07:48.395	hello	t	f	maybe	2020-01-03 18:45:25.935	\N	\N	 hello, back at you
1001	2	5	2	2020-01-04 10:43:49.94	hello again my old friend	t	f	\N	\N	\N	\N	\N
1002	2	5	2	2020-01-04 10:43:55.717	hello again my old friend	t	f	\N	\N	\N	\N	\N
1003	2	5	2	2020-01-04 10:43:56.565	hello again my old friend	t	f	\N	\N	\N	\N	\N
1005	2	2	1039	2020-01-08 08:37:32.245	I want it real bad	t	t	\N	\N	\N	\N	\N
1006	2	2	1039	2020-01-08 08:37:37.054	I want it real bad	t	t	\N	\N	\N	\N	\N
1007	2	2	1039	2020-01-08 08:39:30.271	do you have it	t	f	\N	\N	\N	\N	\N
1008	2	2	1039	2020-01-08 08:40:43.26	Gimme Gimme	f	t	\N	\N	\N	\N	\N
1009	2	7	1	2020-01-08 12:47:31.292	I really want this thing	t	t	\N	\N	\N	\N	\N
1	2	5	2	2020-01-02 22:19:36.870366	Hey	t	f	yes	2020-01-08 19:07:28.426	\N	\N	you can def have it\n
1010	2	2	1041	2020-01-08 19:11:36.047	I really want it bad man	t	t	\N	\N	\N	\N	\N
1011	2	5	2	2020-01-09 07:13:43.207	give you a 5 for that	t	t	\N	2020-01-09 07:14:36.261	\N	no	that is not enough man
1012	2	2	1041	2020-01-09 11:36:53.924	I do want all the things\n	t	t	\N	2020-01-09 11:39:11.04	\N	yes	500 dollars
\.


--
-- Data for Name: schemaversion; Type: TABLE DATA; Schema: public; Owner: nanosh
--

COPY public.schemaversion (version, name, md5, run_at) FROM stdin;
0	\N	\N	\N
1	create_morkit_inventory_messages_users	05e4dd5b46ef4c7671ac47c651339bc8	2020-01-02 16:29:50.239+00
\.


--
-- Name: category_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nanosh
--

SELECT pg_catalog.setval('public.category_list_id_seq', 1046, true);


--
-- Name: inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nanosh
--

SELECT pg_catalog.setval('public.inventory_id_seq', 1049, true);


--
-- Name: morkit_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nanosh
--

SELECT pg_catalog.setval('public.morkit_user_id_seq', 1, false);


--
-- Name: msg_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nanosh
--

SELECT pg_catalog.setval('public.msg_id_seq', 1012, true);


--
-- Name: category_list category_list_pkey; Type: CONSTRAINT; Schema: public; Owner: nanosh
--

ALTER TABLE ONLY public.category_list
    ADD CONSTRAINT category_list_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: nanosh
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: morkit_user morkit_user_pkey; Type: CONSTRAINT; Schema: public; Owner: nanosh
--

ALTER TABLE ONLY public.morkit_user
    ADD CONSTRAINT morkit_user_pkey PRIMARY KEY (id);


--
-- Name: msg msg_pkey; Type: CONSTRAINT; Schema: public; Owner: nanosh
--

ALTER TABLE ONLY public.msg
    ADD CONSTRAINT msg_pkey PRIMARY KEY (id);


--
-- Name: schemaversion schemaversion_pkey; Type: CONSTRAINT; Schema: public; Owner: nanosh
--

ALTER TABLE ONLY public.schemaversion
    ADD CONSTRAINT schemaversion_pkey PRIMARY KEY (version);


--
-- Name: category_list category_list_list_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nanosh
--

ALTER TABLE ONLY public.category_list
    ADD CONSTRAINT category_list_list_owner_fkey FOREIGN KEY (list_owner) REFERENCES public.morkit_user(id) ON DELETE CASCADE;


--
-- Name: inventory inventory_item_list_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nanosh
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_item_list_fkey FOREIGN KEY (item_list) REFERENCES public.category_list(id) ON DELETE CASCADE;


--
-- Name: inventory inventory_item_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nanosh
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_item_owner_fkey FOREIGN KEY (item_owner) REFERENCES public.morkit_user(id) ON DELETE CASCADE;


--
-- Name: msg msg_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nanosh
--

ALTER TABLE ONLY public.msg
    ADD CONSTRAINT msg_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.inventory(id) ON DELETE CASCADE;


--
-- Name: msg msg_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nanosh
--

ALTER TABLE ONLY public.msg
    ADD CONSTRAINT msg_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.morkit_user(id) ON DELETE CASCADE;


--
-- Name: msg msg_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nanosh
--

ALTER TABLE ONLY public.msg
    ADD CONSTRAINT msg_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.morkit_user(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


  `;
}
module.exports = { instantDB };
