function makeUsersArray() {
  return [
    {
      username: 'Matt',
      since: new Date(),
      pass: 'passwordMat',
      fullname: 'Kylo Ren',
      about: 'A Sith'
    },
    {
      username: 'Putin',
      since: new Date(),
      pass: 'passwordPut',
      fullname: 'Donald J trump',
      about:
        'Best President in the history of America, many people have said, many people have said, not just regular people, important people, many important people on both sides.'
    },
    {
      username: 'Vermin',
      since: new Date(),
      pass: 'passwordVer',
      fullname: 'Franz Kafka',
      about: 'A human'
    },
    {
      username: 'RobertGalbraith',
      since: new Date(),
      pass: 'passwordRob',
      fullname: 'J K Rowling',
      about: 'A human'
    },
    {
      username: 'Mr Pants',
      since: new Date(),
      pass: 'passwordMrP',
      fullname:
        'Sponge Bob Squarepants',
      about: 'A Sponge with pants'
    },
    {
      username: 'Gary',
      since: new Date(),
      pass: 'passwordGar',
      fullname: 'Gary',
      about: 'A sea slug'
    },
    {
      username: 'Horatio',
      since: new Date(),
      pass: 'passwordHor',
      fullname: 'Horty Nortatio',
      about: 'Another human'
    }
  ];
}
module.exports = { makeUsersArray };
