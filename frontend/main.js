let token = '';
let user = '';

async function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: user, password: pass })
  });

  const data = await res.json();

  if (!res.ok) {
    alert('Error starting session');
    return;
  }

  token = data.token;
  user = parseJwt(token).name;

  document.getElementById('login-section').style.display = 'none';
  document.getElementById('main-section').style.display = 'block';
  document.getElementById('user-name').textContent = user;
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

async function getWorker() {
  const id = document.getElementById('worker-id').value;

  const res = await fetch(`/api/workers/${id}`);
  const data = await res.json();

  if (!res.ok) {
    alert('Worker not found');
    return;
  }

  document.getElementById('worker-info').textContent = JSON.stringify(data, null, 2);
}

async function createProject() {
  const workerId = document.getElementById('project-workerId').value;
  const name = document.getElementById('project-name').value;
  const description = document.getElementById('project-description').value;

  const res = await fetch('/api/projects/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    },
    body: JSON.stringify({ workerId, name, description })
  });

  const data = await res.json();

  if (!res.ok) {
    alert('Error creating project');
    return;
  }

  alert('✅ Project created');
}