module.exports = function(propertyRef, value, modelClass) {
  const formatter = modelClass.formatter();
  const columnName = formatter.wrap(propertyRef.fullColumnName());

  return {
    method: 'whereRaw',
    args: [`${columnName} @@ to_tsquery(?)`, value.toLowerCase()]
  };
};
