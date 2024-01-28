const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(request, response) {
    // TODO: Add your code here
    //{ mergeParams: true } in router.js gets the movieId req param
    const movieId = Number(request.params.movieId);
    //if there is a movieId change the format
    if(movieId) {
      const data = await service.listByMovie(movieId);
      response.json({ data });
    } else {
      const data = await service.list();
      response.json({ data });
    }
}

module.exports = {
  list: asyncErrorBoundary(list),
};
