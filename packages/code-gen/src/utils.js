const upperCaseFirst = str => str[0].toUpperCase() + str.substring(1);

const lowerCaseFirst = str => str[0].toLowerCase() + str.substring(1);

module.exports = {
  upperCaseFirst,
  lowerCaseFirst,
};
