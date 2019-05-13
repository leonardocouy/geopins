const user = {
  _id: "1",
  name: "Leo",
  email: "leoflores@hotmail.com",
  picture: "http://naruto.com/image.png",
};

module.exports = {
  Query: {
    me: () => user
  },
};
