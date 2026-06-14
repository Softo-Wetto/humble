import { authenticateSuperuser, findFirst, request } from "./lib/pocketbase-admin.mjs";

const people = [
  ["maya", "Maya", "maya@humble.local", "1997-02-18", 29, "woman", ["man", "nonbinary"], "West End", "Community gardener, careful listener, and enthusiastic Sunday cook."],
  ["theo", "Theo", "theo@humble.local", "1994-09-03", 31, "man", ["woman"], "New Farm", "Ceramicist, bookshop regular, and the friend who remembers how you take your tea."],
  ["imani", "Imani", "imani@humble.local", "1998-01-22", 28, "woman", ["woman", "nonbinary"], "Paddington", "Museum afternoons, long-table dinners, and making playlists for very specific moods."],
  ["alex", "Alex", "alex@humble.local", "1995-11-11", 30, "nonbinary", ["woman", "man", "nonbinary"], "South Brisbane", "A patient photographer who loves river walks, tiny galleries, and feeding friends."],
  ["sam", "Sam", "sam@humble.local", "1992-07-09", 33, "man", ["woman", "nonbinary"], "Woolloongabba", "Paramedic, backyard herb grower, and committed believer in breakfast for dinner."],
  ["nina", "Nina", "nina@humble.local", "1996-04-28", 30, "woman", ["man"], "Toowong", "Teacher, amateur baker, and an earnest collector of excellent local walks."],
];

const password = "HumbleLocal123!";

function profileImage(name, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100"><rect width="100%" height="100%" fill="${color}"/><circle cx="450" cy="360" r="180" fill="#ffffff44"/><ellipse cx="450" cy="930" rx="310" ry="360" fill="#ffffff2b"/><text x="450" y="405" text-anchor="middle" font-size="120" fill="#fff" font-family="serif">${name[0]}</text></svg>`;
}

async function createUser(token, person, role = "member") {
  const [key, , email, birthDate] = person;
  let user = await findFirst(token, "users", `seed_key="${key}"`);
  if (user) return user;
  user = await request("/api/collections/users/records", {
    method: "POST",
    token,
    body: JSON.stringify({ email, password, passwordConfirm: password, birth_date: birthDate, role, account_state: "active", onboarding_complete: true, seed_key: key }),
  });
  return user;
}

async function ensureProfile(token, person, user, index) {
  const [key, name, , , age, gender, interestedIn, city, bio] = person;
  if (!(await findFirst(token, "profiles", `seed_key="${key}"`))) {
    const form = new FormData();
    Object.entries({ user: user.id, display_name: name, age: String(age), city, region: "Queensland", gender, pronouns: "", bio, interests: JSON.stringify(["Cooking", "Outdoors", "Arts"]), values: JSON.stringify(["Kindness", "Curiosity", "Community"]), is_published: "true", moderation_visible: "true", seed_key: key }).forEach(([field, value]) => form.append(field, value));
    const colors = ["#a97861", "#68776e", "#936f67", "#7d778b", "#7d856a", "#a18372"];
    form.append("photos", new Blob([profileImage(name, colors[index])], { type: "image/svg+xml" }), `${key}.svg`);
    await request("/api/collections/profiles/records", { method: "POST", token, body: form });
  }
  if (!(await findFirst(token, "preferences", `user="${user.id}"`))) {
    await request("/api/collections/preferences/records", { method: "POST", token, body: JSON.stringify({ user: user.id, interested_in: interestedIn, minimum_age: 24, maximum_age: 40, regions: ["Queensland"] }) });
  }
}

export async function seedPocketBase() {
  const token = await authenticateSuperuser();
  const users = [];
  for (const [index, person] of people.entries()) {
    const user = await createUser(token, person);
    await ensureProfile(token, person, user, index);
    users.push(user);
  }

  const adminPerson = ["admin", "Humble Admin", "admin-member@humble.local", "1990-01-01", 36, "nonbinary", ["woman"], "Brisbane", "Humble moderation account for local development and workflow verification."];
  await createUser(token, adminPerson, "admin");

  if (!(await findFirst(token, "compliments", `request_key="seed-maya-theo"`))) {
    await request("/api/collections/compliments/records", { method: "POST", token, body: JSON.stringify({ sender: users[0].id, recipient: users[1].id, body: "Your care for your community really stood out to me.", status: "pending", request_key: "seed-maya-theo" }) });
  }
  console.log(`Seeded ${people.length} profiles. Member password: ${password}`);
}

if (import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, "/")}`) {
  seedPocketBase().catch((error) => { console.error(error.message); process.exit(1); });
}
