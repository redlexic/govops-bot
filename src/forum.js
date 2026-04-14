// Generic Discourse forum client for the Sky Ecosystem forum.
//
// Usage:
//   const forum = require("./forum");
//   const posts = await forum.getUserPosts("soterlabs");
//   const topic = await forum.getTopic(27825);

const BASE_URL = "https://forum.skyeco.com";
const API_KEY = process.env.DISCOURSE_API_KEY;
const API_USERNAME = "soterlabs";

async function request(path, params = {}) {
  if (!API_KEY) {
    throw new Error("DISCOURSE_API_KEY env var is required");
  }

  const url = new URL(path, BASE_URL);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url, {
    headers: {
      "Api-Key": API_KEY,
      "Api-Username": API_USERNAME,
    },
  });

  if (!res.ok) {
    throw new Error(`Discourse API ${res.status}: ${res.statusText} — ${path}`);
  }

  return res.json();
}

// ── User activity ───────────────────────────────────────────────

// action_type 4 = new topic, 5 = reply
async function getUserPosts(username, { offset = 0, filter = "4,5" } = {}) {
  const data = await request("/user_actions.json", { username, filter, offset });
  return data.user_actions;
}

// ── Topics ──────────────────────────────────────────────────────

async function getTopic(topicId) {
  return request(`/t/${topicId}.json`);
}

async function getTopicPosts(topicId) {
  const topic = await getTopic(topicId);
  return topic.post_stream.posts;
}

// ── Posts ────────────────────────────────────────────────────────

async function getPost(postId) {
  return request(`/posts/${postId}.json`);
}

// ── Categories ──────────────────────────────────────────────────

async function getCategories() {
  const data = await request("/categories.json");
  return data.category_list.categories;
}

// ── Search ──────────────────────────────────────────────────────

async function search(query, { page = 1 } = {}) {
  const data = await request("/search.json", { q: query, page });
  return data;
}

module.exports = {
  request,
  getUserPosts,
  getTopic,
  getTopicPosts,
  getPost,
  getCategories,
  search,
};
