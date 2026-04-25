<script lang="ts">
	import { goto } from '$app/navigation';
	import { login, register } from '$lib/api';
	import { auth } from '$lib/stores/auth';

	let activeTab = $state<'bidder' | 'officer'>('bidder');
	let isRegistering = $state(false);
	let showPassword = $state(false);
	let username = $state('');
	let password = $state('');
	let captchaInput = $state('');
	let errorMsg = $state('');
	let successMsg = $state('');
	let loading = $state(false);

	function generateCaptcha(): string {
		const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
		let result = '';
		for (let i = 0; i < 5; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	}

	let captchaCode = $state(generateCaptcha());

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		errorMsg = '';
		successMsg = '';

		if (!username.trim() || !password.trim()) {
			errorMsg = 'Please enter both username and password.';
			return;
		}

		if (captchaInput.toUpperCase() !== captchaCode) {
			errorMsg = 'Invalid CAPTCHA. Please try again.';
			captchaCode = generateCaptcha();
			captchaInput = '';
			return;
		}

		loading = true;
		try {
			if (isRegistering) {
				const role = activeTab === 'officer' ? 'admin' : 'bidder';
				await register(username, password, role);
				successMsg = 'Registration successful! You can now login.';
				isRegistering = false;
				password = '';
				captchaCode = generateCaptcha();
				captchaInput = '';
			} else {
				const res = await login(username, password);
				auth.login(res.token, res.user);
				if (res.user.role === 'admin') {
					goto('/dashboard/officer');
				} else {
					goto('/dashboard/bidder');
				}
			}
		} catch (err: any) {
			errorMsg = err.message || 'Login failed. Please check your credentials.';
			captchaCode = generateCaptcha();
			captchaInput = '';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>SCCL - Login Page</title>
	<meta name="description" content="Secure login portal for SCCL bidders and officers. Access the e-Procurement ecosystem, manage tenders, and view procurement activities." />
</svelte:head>

<!-- Main Content -->
<main class="main-content">
	<!-- Left Panel -->
	<div class="left-panel">
		<div class="geo-pattern"></div>
		<div class="left-inner">
			<div class="logo-circle">
				<span class="logo-text">SCCL</span>
			</div>
			<h1 class="portal-title">e-Procurement Portal</h1>
			<p class="portal-tagline">Transparent · Secure · Efficient</p>
		</div>
	</div>

	<!-- Right Panel -->
	<div class="right-panel">
		<div class="login-card">
			<div class="card-header">
				<h2 class="card-title">
					{#if isRegistering}
						{activeTab === 'bidder' ? 'Bidder Registration' : 'Officer Registration'}
					{:else}
						{activeTab === 'bidder' ? 'Bidder Login' : 'Officer Login'}
					{/if}
				</h2>
				<p class="card-subtitle">{activeTab === 'bidder' ? 'Secure access to the SCCL procurement ecosystem' : 'Internal SCCL staff authentication portal'}</p>
			</div>

			<!-- Tab Switcher -->
			<div class="tab-switcher">
				<button type="button" class="tab-btn" class:active={activeTab === 'bidder'} id="tab-bidder" onclick={() => activeTab = 'bidder'}>Bidder</button>
				<button type="button" class="tab-btn" class:active={activeTab === 'officer'} id="tab-officer" onclick={() => activeTab = 'officer'}>SCCL Officer</button>
			</div>

			{#if errorMsg}
				<div class="error-banner">
					<span class="material-symbols-outlined" style="font-size:18px">error</span>
					{errorMsg}
				</div>
			{/if}
			{#if successMsg}
				<div class="success-banner" style="background:#bbf7d0; color:#166534; padding:8px; border-radius:4px; margin-bottom:16px; font-size:13px; font-weight:500;">
					{successMsg}
				</div>
			{/if}

			<form class="login-form" novalidate onsubmit={handleSubmit}>
				<!-- Username -->
				<div class="field-group">
					<label class="field-label" for="username">{activeTab === 'bidder' ? 'Bidder ID' : 'Employee ID'}</label>
					<div class="input-wrapper">
						<span class="input-icon material-symbols-outlined">{activeTab === 'bidder' ? 'person' : 'badge'}</span>
						<input
							type="text"
							id="username"
							class="form-input"
							placeholder={activeTab === 'bidder' ? 'Enter your registered Bidder ID' : 'Enter your SCCL Employee ID'}
							bind:value={username}
						/>
					</div>
				</div>

				<!-- Password -->
				<div class="field-group">
					<label class="field-label" for="password">Password</label>
					<div class="input-wrapper">
						<span class="input-icon material-symbols-outlined">lock</span>
						<input
							type={showPassword ? 'text' : 'password'}
							id="password"
							class="form-input"
							placeholder="Enter your password"
							bind:value={password}
						/>
						<button
							type="button"
							class="eye-toggle"
							id="togglePwd"
							aria-label="Toggle password visibility"
							onclick={() => showPassword = !showPassword}
						>
							<span class="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
						</button>
					</div>
				</div>

				<!-- MFA Notice -->
				<div class="mfa-notice">
					<span class="material-symbols-outlined mfa-icon" style="font-variation-settings:'FILL' 1"
						>security</span
					>
					<span class="mfa-text">MFA is enabled for your account. Have your device ready.</span>
				</div>

				<!-- CAPTCHA -->
				<div class="captcha-box">
					<label class="captcha-label">CAPTCHA Verification</label>
					<div class="captcha-row">
						<div class="captcha-image">{captchaCode}</div>
						<button type="button" class="captcha-refresh" aria-label="Refresh CAPTCHA" onclick={() => captchaCode = generateCaptcha()}>
							<span class="material-symbols-outlined">refresh</span>
						</button>
					</div>
					<input type="text" class="form-input" placeholder="Enter text from image" bind:value={captchaInput} />
				</div>

				<!-- Actions -->
				<div class="action-group">
					<button type="submit" class="btn-primary" disabled={loading}>
						{#if loading}
							{isRegistering ? 'Registering...' : 'Signing in...'}
						{:else}
							{isRegistering ? 'Register' : 'Secure Login'}
							<span class="material-symbols-outlined btn-arrow">arrow_forward</span>
						{/if}
					</button>

					<div class="divider">
						<span class="divider-line"></span>
						<span class="divider-text">OR</span>
						<span class="divider-line"></span>
					</div>

					<button type="button" class="btn-secondary" onclick={() => isRegistering = !isRegistering}>
						<span class="material-symbols-outlined">{isRegistering ? 'login' : 'person_add'}</span>
						{isRegistering ? 'I already have an account' : 'Create a new account'}
					</button>
				</div>
			</form>

			<!-- Links -->
			<div class="card-links">
				<a href="#" class="link-primary">Register as New Bidder</a>
				<div class="link-row">
					<a href="#" class="link-muted">Forgot Password</a>
					<span class="link-sep">|</span>
					<a href="#" class="link-muted link-with-icon">
						Download DSC Guide
						<span class="material-symbols-outlined link-dl-icon">download</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</main>

<style>

/* ============================================================
   MAIN LAYOUT
   ============================================================ */
.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ============================================================
   LEFT PANEL
   ============================================================ */
.left-panel {
  width: 40%;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

/* Geometric background pattern */
.geo-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    #ffffff 10px,
    #ffffff 11px
  );
}

.left-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--spacing-lg);
  max-width: 320px;
}

.logo-circle {
  width: 128px;
  height: 128px;
  background: var(--color-white);
  border-radius: 50%;
  border: 4px solid var(--color-surface-tint);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
}

.logo-text {
  color: var(--color-primary);
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.portal-title {
  color: var(--color-white);
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.portal-tagline {
  color: rgba(255,255,255,0.75);
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border-top: 1px solid rgba(255,255,255,0.2);
  padding-top: var(--spacing-md);
  width: 100%;
}

/* ============================================================
   RIGHT PANEL
   ============================================================ */
.right-panel {
  flex: 1;
  background: var(--color-white);
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg) var(--spacing-xl);
}

/* ============================================================
   LOGIN CARD
   ============================================================ */
.login-card {
  width: 100%;
  max-width: 480px;
  background: var(--color-white);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-card);
}

.card-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.card-title {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.card-subtitle {
  font-size: 12px;
  line-height: 1.4;
  color: var(--color-on-surface-muted);
}

/* ============================================================
   TAB SWITCHER
   ============================================================ */
.tab-switcher {
  display: flex;
  border-bottom: 1px solid var(--color-outline-variant);
  margin-bottom: var(--spacing-lg);
}

.tab-btn {
  flex: 1;
  padding-bottom: var(--spacing-sm);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
  color: var(--color-on-surface-muted);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 0.15s, border-color 0.15s;
  background: none;
  border-left: none;
  border-right: none;
  border-top: none;
}

.tab-btn:hover {
  color: var(--color-primary);
}

.tab-btn.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

/* ============================================================
   FORM
   ============================================================ */
.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.field-label {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-on-surface);
}

/* Input with icon wrapper */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: var(--spacing-sm);
  color: var(--color-outline);
  font-size: 20px;
  pointer-events: none;
  user-select: none;
}

.form-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) 36px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-on-surface);
  background: var(--color-white);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(17,51,34,0.15);
}

.form-input::placeholder {
  color: var(--color-outline);
  font-size: 14px;
}

/* CAPTCHA input has no left icon */
.captcha-box .form-input {
  padding-left: var(--spacing-sm);
}

/* Password eye toggle */
.eye-toggle {
  position: absolute;
  right: var(--spacing-sm);
  display: flex;
  align-items: center;
  color: var(--color-outline);
  padding: 0;
  transition: color 0.15s;
}

.eye-toggle:hover {
  color: var(--color-on-surface);
}

.eye-toggle .material-symbols-outlined {
  font-size: 20px;
}

/* Password input - extra right padding for eye button */
#password {
  padding-right: 40px;
}

/* ============================================================
   MFA NOTICE
   ============================================================ */
.mfa-notice {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-surface-low);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  border: 1px solid rgba(193,200,193,0.5);
}

.mfa-icon {
  color: var(--color-primary);
  font-size: 16px;
  flex-shrink: 0;
}

.mfa-text {
  font-size: 12px;
  line-height: 1.4;
  color: var(--color-on-surface-muted);
}

/* ============================================================
   CAPTCHA
   ============================================================ */
.captcha-box {
  border: 1px solid var(--color-outline-variant);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  background: var(--color-surface-container);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.captcha-label {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-on-surface-muted);
}

.captcha-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-white);
  border: 1px solid var(--color-outline-variant);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
}

.captcha-image {
  height: 40px;
  width: 128px;
  background: var(--color-surface-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.2em;
  text-decoration: line-through;
  color: var(--color-on-surface);
  border-radius: var(--radius-sm);
  user-select: none;
}

.captcha-refresh {
  color: var(--color-primary);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: background 0.15s;
}

.captcha-refresh:hover {
  background: var(--color-surface-low);
}

.captcha-refresh .material-symbols-outlined {
  font-size: 20px;
  display: block;
}

/* ============================================================
   ACTION BUTTONS
   ============================================================ */
.action-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding-top: var(--spacing-sm);
}

.btn-primary {
  width: 100%;
  background: var(--color-primary);
  color: var(--color-white);
  font-size: 14px;
  font-weight: 600;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  transition: background 0.15s;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-primary:active {
  transform: scale(0.99);
}

.btn-arrow {
  font-size: 18px;
}

/* OR Divider */
.divider {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.divider-line {
  flex: 1;
  height: 1px;
  background: var(--color-outline-variant);
}

.divider-text {
  font-size: 12px;
  font-weight: 400;
  color: var(--color-outline);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.btn-secondary {
  width: 100%;
  background: var(--color-white);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  font-size: 14px;
  font-weight: 600;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  transition: background 0.15s;
}

.btn-secondary:hover {
  background: var(--color-surface-low);
}

.btn-secondary:active {
  transform: scale(0.99);
}

.btn-secondary .material-symbols-outlined {
  font-size: 18px;
}

/* ============================================================
   CARD LINKS
   ============================================================ */
.card-links {
  margin-top: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  border-top: 1px solid var(--color-outline-variant);
  padding-top: var(--spacing-lg);
  font-size: 12px;
  line-height: 1.4;
}

.link-primary {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 12px;
}

.link-primary:hover {
  text-decoration: underline;
}

.link-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--color-on-surface-muted);
}

.link-muted {
  color: var(--color-on-surface-muted);
  font-size: 12px;
  transition: color 0.15s;
}

.link-muted:hover {
  color: var(--color-primary);
}

.link-sep {
  color: var(--color-outline-variant);
}

.link-with-icon {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.link-dl-icon {
  font-size: 14px;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 768px) {
  body {
    overflow: auto;
  }

  .main-content {
    flex-direction: column;
    overflow: visible;
  }

  .left-panel {
    display: none;
  }

  .right-panel {
    padding: var(--spacing-lg);
    align-items: flex-start;
  }

  .login-card {
    padding: var(--spacing-lg);
  }
}

.error-banner {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 13px;
  font-weight: 500;
  margin-bottom: var(--spacing-md);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>