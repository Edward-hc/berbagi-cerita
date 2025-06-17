import AuthPresenter from '../../presenters/auth-presenter.js';

const LoginPage = {
  async render() {
    return `
      <style>
        .auth-section {
          max-width: 380px;
          margin: 3rem auto;
          padding: 2rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
          border-radius: 10px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #fff;
          color: #333;
        }

        .auth-section h2 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #4A90E2;
          font-weight: 700;
        }

        form {
          display: flex;
          flex-direction: column;
        }

        label {
          margin-bottom: 0.25rem;
          font-weight: 600;
        }

        input[type="email"],
        input[type="password"],
        input[type="text"] {
          padding: 0.5rem 0.75rem;
          margin-bottom: 1.2rem;
          border: 1.8px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        input[type="email"]:focus,
        input[type="password"]:focus,
        input[type="text"]:focus {
          outline: none;
          border-color: #4A90E2;
          box-shadow: 0 0 5px #4A90E2;
        }

        button {
          padding: 0.75rem;
          background-color: #4A90E2;
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: 700;
          cursor: pointer;
          font-size: 1.1rem;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #357ABD;
        }

        #message {
          margin-top: 1rem;
          text-align: center;
          font-weight: 600;
          color: #d33;
          min-height: 1.2rem;
        }

        p.toggle-text {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #555;
        }

        p.toggle-text a {
          cursor: pointer;
          color: #4A90E2;
          text-decoration: none;
          font-weight: 600;
        }

        p.toggle-text a:hover {
          text-decoration: underline;
        }

        @media (max-width: 420px) {
          .auth-section {
            margin: 2rem 1rem;
            padding: 1.5rem;
          }
        }
      </style>

      <section class="auth-section" role="main" aria-labelledby="formTitle">
        <h2 id="formTitle">Login</h2>

        <form id="authForm" aria-describedby="message">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" autocomplete="username" required aria-required="true" />

          <label for="password">Password</label>
          <input type="password" id="password" name="password" autocomplete="current-password" required aria-required="true" />

          <div id="nameField" style="display:none;">
            <label for="name">Nama Lengkap</label>
            <input type="text" id="name" name="name" autocomplete="name" />
          </div>

          <button type="submit" id="submitBtn">Login</button>
        </form>

        <p id="message" role="alert" aria-live="polite"></p>

        <p class="toggle-text">
          <a href="#" id="toggleForm" aria-controls="authForm" aria-expanded="false">Belum punya akun? Daftar di sini</a>
        </p>
      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById('authForm');
    const message = document.getElementById('message');
    const toggleLink = document.getElementById('toggleForm');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    const nameField = document.getElementById('nameField');

    let isLogin = true;

    toggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      isLogin = !isLogin;

      if (isLogin) {
        formTitle.textContent = 'Login';
        submitBtn.textContent = 'Login';
        nameField.style.display = 'none';
        toggleLink.textContent = 'Belum punya akun? Daftar di sini';
        toggleLink.setAttribute('aria-expanded', 'false');
      } else {
        formTitle.textContent = 'Register';
        submitBtn.textContent = 'Daftar';
        nameField.style.display = 'block';
        toggleLink.textContent = 'Sudah punya akun? Login di sini';
        toggleLink.setAttribute('aria-expanded', 'true');
      }
      message.textContent = '';
      form.reset();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = form.email.value.trim();
      const password = form.password.value.trim();

      if (!email || !password) {
        message.textContent = 'Email dan password wajib diisi.';
        return;
      }

      if (!isLogin) {
        // Register
        const name = form.name.value.trim();
        if (!name) {
          message.textContent = 'Nama lengkap wajib diisi.';
          return;
        }

        try {
          const result = await AuthPresenter.register(name, email, password);
          message.style.color = 'green';
          message.textContent = 'Registrasi berhasil! Silakan login.';
          toggleLink.click();
        } catch (error) {
          message.style.color = '#d33';
          message.textContent = error.message;
        }
      } else {
        try {
          const result = await AuthPresenter.login(email, password);
          localStorage.setItem('token', result.loginResult.token);
          message.style.color = 'green';
          message.textContent = 'Login berhasil! Mengalihkan ke halaman utama...';
          setTimeout(() => {
            window.location.hash = '#/';
          }, 1200);
        } catch (error) {
          message.style.color = '#d33';
          message.textContent = error.message;
        }
      }
    });
  },
};

export default LoginPage;
