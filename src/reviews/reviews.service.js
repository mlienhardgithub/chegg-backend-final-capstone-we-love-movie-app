const db = require("../db/connection");

const tableName = "reviews";

async function destroy(reviewId) {
  // TODO: Write your code here
  return db
    .from(tableName)
    .where({ "review_id": reviewId })
    .del();
}

async function list(movie_id) {
  // TODO: Write your code here
  return db
    .from("reviews as r")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .where({"r.movie_id": movie_id})
    .select(
      "r.review_id", "r.content", "r.score", "r.created_at", "r.updated_at", "r.movie_id",
      "c.critic_id", "c.preferred_name", "c.surname", "c.organization_name",
      "c.created_at as critics_created_at", "c.updated_at as critics_updated_at",
    )
    
    /* tried to find a way to call setCritic, but failed to resolve the promises
    .then(reviews => {
      reviews.forEach(review => {
        console.log('review', review)
      })
    })
    .then((reviews) => {
      return Promise.resolve([
        reviews.map((review) => {
          return Promise.resolve(setCritic(review))
        })
      ]);
    })
    .then(results => console.log('results', results)) //unresolved promises
    .catch(error => console.log(error))
    */
  ;
}

async function read(reviewId) {
  // TODO: Write your code here
  return db
    .from(tableName)
    .select("*")
    .where({ "review_id": reviewId })
    .first();
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  return db
    .from(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

module.exports = {
  destroy,
  list,
  read,
  update,
};
