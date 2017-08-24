module.exports = function(propertyRef, value, modelClass) {
  const formatter = modelClass.formatter();
  const columnName = formatter.wrap(propertyRef.fullColumnName());

  const searchValue = value.split(' ').map(val => val.toLowerCase()).join(' & ');

  return {
    method: 'whereRaw',
    args: [`${columnName} @@ to_tsquery(?)`, searchValue]
  };
};
