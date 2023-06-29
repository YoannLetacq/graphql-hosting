// js/api.js

async function fetchWithCredentials(username, password) {
  const response = await fetch("https://zone01normandie.org/api/auth/signin", {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(username + ":" + password),
    },
  });
  return response;
}

export async function authenticateUser(username, password) {
  const response = await fetchWithCredentials(username, password);

  if (!response.ok) {
    throw new Error('Invalid username or password');
  }

  const data = await response.json();
  console.log(data);
  return data;
}

export async function getUserData(token) {
  const url = 'https://zone01normandie.org/api/graphql-engine/v1/graphql';
  const query = `{
    user {
      id
      login
      firstName
      lastName
      auditRatio
      xps {
        amount
        originEventId
        path
      }


      progresses(
        where:{
          _and:{
            object:{type:{_eq:"exercise"}},
            isDone:{_eq:true}
          }
        }){

        grade
        path
        isDone

        object{
            type
            name
        }
    }


    }
    xp_total: transaction_aggregate(where: {type: {_eq: "xp"}, eventId: {_eq: 32}}) {
      aggregate {
        sum {
          amount
        }
      }
    }

  }`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  const data = await response.json();
  return data;
}