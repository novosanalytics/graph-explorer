/**
 * It returns a Gremlin template to number of vertices of a particular label
 */
const edgeTypeCountTemplate = (label: string) => {
  return `g.E().hasLabel("${label}").count()`;
};


export default edgeTypeCountTemplate;
