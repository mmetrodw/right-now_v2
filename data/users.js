const users = [
  {
    email: '1@1.ua',
    name: 'user1',
    password: '1111',
    id: 1
  },
  {
    email: '3@3.ua',
    name: 'user2',
    password: '3333',
    id: 5
  },
  {
    email: '2@2.ua',
    name: 'user3',
    password: '2222',
    id: 9
  }
];

export const getUserByEmail = (email) => {
  const found = users.find((user) => user.email === email);
  return found;
};