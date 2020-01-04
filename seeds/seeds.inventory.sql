BEGIN;
  
INSERT INTO morkit_user (id, username, since, pass, fullname, about)
  VALUES
  (7, 'Matt', now(), 'passwordMat', 'Kylo Ren', 'A Sith'), 
  (2, 'Putin', now(), 'passwordPut', 'Donald J trump', 'Best President in the history of America, many people have said, many people have said, not just regular people, important people, many important people on both sides.'), 
  (1, 'Vermin', now(), 'passwordVer', 'Franz Kafka', 'A human'), 
  (4, 'RobertGalbraith', now(), 'passwordRob', 'J K Rowling', 'A human'), 
  (3, 'Mr Pants', now(), 'passwordMrP', 'Sponge Bob Squarepants', 'A Sponge with pants'), 
  (5, 'Gary', now(), 'passwordGar', 'Gary', 'A sea slug'), 
  (6, 'Horatio', now(), 'passwordHor', 'Horty Nortatio', 'Another human');

  insert into category_list (id, list_owner, list_name)
  values
  (1, 2, 'Sith Cloaks'),
  (2, 2, 'dragon stuff'),
  (3, 2, 'other stuff'),
  (4, 2, 'inter-dimensional time cannons'),
  (5, 2, 'socks'),
  (6, 7, 'super-secret falcons'),
  (7, 3, 'mystery-fish'),
  (8, 5, 'panda food');

INSERT INTO inventory (id, item_name, item_body, item_owner, item_is, item_list)
  VALUES
  (1, 'maltese falcon', '', 7, 'selling', 6), 
  (2, 'milenium falcon', 'for parts', 5, 'selling', 8), 
  (3, 'cup of soup', 'last one', 2, 'selling', 2), 
  (4, 'vintage computer', 'further discounted', 2, 'selling', 5), 
  (5, 'all the things', 'basically free', 2, 'buying',1 );

insert into msg (id, sender_id, receiver_id, item_id, send_time, content, buy, check_available, rsp_time, rsp_check, rsp_buy, rsp_both, rsp_content)
values
(1, 2, 5, 2, now(), 'Hey', true, false, null, null, null, null, null),
(2, 7, 2, 3, now(), 'Yo', true, false, null, null, null, null, null),
(3, 6, 7, 1, now(), 'Sup', false, true, null, null, null, null, null),
(4, 3, 2, 4, now(), 'hi', true, true, null, null, null, null, null),
(5, 1, 2, 4, now(), 'I want that', true, false, null, null, null, null, null);

COMMIT;
