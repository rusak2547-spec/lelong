const BASE_URL = process.argv[2] || "http://localhost:3000";

console.log(`\x1b[36mRunning FULL Endpoint Scan against: ${BASE_URL}\x1b[0m\n`);

const routes = [
  // --- Public Routes ---
  { path: "/", expectedStatus: [307, 308], description: "Root Redirect" },
  { path: "/ms", expectedStatus: 200, description: "Homepage (All)" },
  {
    path: "/ms?category=GOLD",
    expectedStatus: 200,
    description: "Homepage (Filter: Gold)",
  },
  {
    path: "/ms?category=GADGET",
    expectedStatus: 200,
    description: "Homepage (Filter: Gadget)",
  },
  {
    path: "/ms/product/1",
    expectedStatus: [200, 404],
    description: "Product Detail (Valid/Invalid)",
  },

  // --- Admin Public ---
  {
    path: "/ms/admin/login",
    expectedStatus: 200,
    description: "Admin Login Page",
  },

  // --- Admin Protected (Expect 200 if logged in, 307 if not) ---
  // Note: For basic smoke test without cookies, these should REDIRECT to login
  {
    path: "/ms/admin/dashboard",
    expectedStatus: [200, 307],
    description: "Admin Dashboard",
  },
  {
    path: "/ms/admin/products/new",
    expectedStatus: [200, 307],
    description: "Admin New Product",
  },
  {
    path: "/ms/admin/settings",
    expectedStatus: [200, 307],
    description: "Admin Global Settings",
  },

  // --- Assets / API Routes ---
  {
    path: "/uploads/test.png",
    expectedStatus: [200, 404],
    description: "Uploads Access",
  },
  {
    path: "/ms/404-check",
    expectedStatus: 404,
    description: "Global 404 Page Check",
  }, // Harusnya 404
];

async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const route of routes) {
    const url = `${BASE_URL}${route.path}`;
    try {
      const response = await fetch(url, { redirect: "manual" });
      const status = response.status;

      const expected = Array.isArray(route.expectedStatus)
        ? route.expectedStatus
        : [route.expectedStatus];

      if (expected.includes(status)) {
        console.log(
          `\x1b[32m[PASS]\x1b[0m ${route.description.padEnd(30)} (${
            route.path
          }) -> Status: ${status}`
        );
        passed++;
      } else {
        console.log(
          `\x1b[31m[FAIL]\x1b[0m ${route.description.padEnd(30)} (${
            route.path
          }) -> Expected: ${expected.join("/")}, Got: ${status}`
        );
        failed++;
      }
    } catch (error) {
      console.log(
        `\x1b[31m[ERR ]\x1b[0m ${route.description.padEnd(30)} (${
          route.path
        }) -> Error: ${error.message}`
      );
      failed++;
    }
  }

  console.log("\n---------------------------------------------------");
  console.log(`Tests Completed. Passed: ${passed}, Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
