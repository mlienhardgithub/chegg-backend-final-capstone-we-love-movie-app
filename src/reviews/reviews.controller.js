const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
  // TODO: Write your code here
  const { reviewId } = request.params;
  const review = await service.read(reviewId);
  console.log('reviewExists request.params', request.params);
  console.log('reviewExists review', review);
  if (review) {
    response.locals.review = review;
    return next();
  }
  return next({ status: 404, message: `Review cannot be found.` });
}

async function destroy(request, response) {
  // TODO: Write your code here
  const review = response.locals.review;
  await service.destroy(review.review_id);
  response.sendStatus(204);
}

async function list(request, response) {
  // TODO: Write your code here
  //{ mergeParams: true } in router.js gets the movieId req param
  const movieId = Number(request.params.movieId);
  const reviews = await service.list(movieId);
  //map the data set to the formatted response
  const data = reviews.map((review) => {
    return {
      review_id: review['review_id'],
      content: review['content'],
      score: review['score'],
      created_at: review['created_at'],
      updated_at: review['updated_at'],
      critic_id: review['critic_id'],
      movie_id: review['movie_id'],
      critic: {
        critic_id: review['critic_id'],
        preferred_name: review['preferred_name'],
        surname: review['surname'],
        organization_name: review['organization_name'],
        created_at: review['critics_created_at'],
        updated_at: review['critics_updated_at'],
      }
    };
  });
  response.json({ data: data });
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(request, response) {
  // TODO: Write your code here
  const updatedReview = {
    ...response.locals.review,
    ...request.body.data,
    review_id: response.locals.review.review_id,
  };
  const data = await service.update(updatedReview);
  response.json({ data });
}

module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
