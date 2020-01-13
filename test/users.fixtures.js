function makeUsersArray() {
  return [
    {
      id: 7,
      username: 'Matt',
      since: new Date(),
      pass: 'passwordMat',
      fullname: 'Kylo Ren',
      about: 'A Sith'
    },
    {
      id: 2,
      username: 'Putin',
      since: new Date(),
      pass: 'passwordPut',
      fullname: 'Donald J trump',
      about:
        'Best President in the history of America, many people have said, many people have said, not just regular people, important people, many important people on both sides.'
    },
    {
      id: 1,
      username: 'Vermin',
      since: new Date(),
      pass: 'passwordVer',
      fullname: 'Franz Kafka',
      about: 'A human'
    },
    {
      id: 4,
      username: 'RobertGalbraith',
      since: new Date(),
      pass: 'passwordRob',
      fullname: 'J K Rowling',
      about: 'A human'
    },
    {
      id: 3,
      username: 'Mr Pants',
      since: new Date(),
      pass: 'passwordMrP',
      fullname:
        'Sponge Bob Squarepants',
      about: 'A Sponge with pants'
    },
    {
      id: 5,
      username: 'Gary',
      since: new Date(),
      pass: 'passwordGar',
      fullname: 'Gary',
      about: 'A sea slug'
    },
    {
      id: 6,
      username: 'Horatio',
      since: new Date(),
      pass: 'passwordHor',
      fullname: 'Horty Nortatio',
      about: 'Another human'
    }
  ];
}
module.exports = { makeUsersArray };
