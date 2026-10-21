import assert from "node:assert/strict";
import test from "node:test";
import { authenticate, createBooking, ApiError } from "./api";

test("browser client obtains CSRF from the current session and omits the UI mode from credentials", async () => {
  const original = globalThis.fetch;
  const requests: { path: string; init?: RequestInit }[] = [];
  globalThis.fetch = async (url, init) => {
    requests.push({ path: String(url), init });
    return Response.json(
      String(url).endsWith("/me")
        ? { csrfToken: "csrf-current-tab" }
        : { ok: true },
    );
  };
  try {
    await authenticate({
      mode: "login",
      email: "patient@example.org",
      password: "password",
    });
    const login = requests[1];
    assert.equal(login.path, "/api/auth/login");
    assert.deepEqual(JSON.parse(String(login.init?.body)), {
      email: "patient@example.org",
      password: "password",
    });
    assert.equal(
      new Headers(login.init?.headers).get("X-CSRF-Token"),
      "csrf-current-tab",
    );
    assert.equal(login.init?.credentials, "include");
    await createBooking({ name: "Patient", phone: "+992000000000" });
    assert.ok(new Headers(requests[3].init?.headers).get("Idempotency-Key"));
    assert.equal(requests[2].path, "/api/auth/me");
  } finally {
    globalThis.fetch = original;
  }
});

test("browser client reports backend validation errors", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (url) =>
    Response.json(
      String(url).endsWith("/me")
        ? { csrfToken: null }
        : { error: "Проверьте заполненные поля" },
      { status: String(url).endsWith("/me") ? 200 : 400 },
    );
  try {
    await assert.rejects(
      createBooking({ name: "Patient", phone: "bad" }),
      (error) => error instanceof ApiError && error.status === 400,
    );
  } finally {
    globalThis.fetch = original;
  }
});
