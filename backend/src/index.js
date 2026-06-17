"use strict";

const defaultHomePage = {
  globalTheme: {
    primaryColor: "#f08a16",
    secondaryColor: "#072b52",
    accentOrange: "#f08a16",
    navyColor: "#072b52",
    tealColor: "#0b6f7d",
    backgroundColor: "#efefea",
    textColor: "#1f2530",
    fontFamily: "Inter, system-ui, sans-serif",
    headingFontFamily: "Georgia, Times New Roman, serif",
    headingFontSize: "2.8rem",
    bodyFontSize: "1rem",
    borderRadius: "0px",
    containerWidth: "1180px",
    sectionSpacing: "80px",
  },
  railSettings: {
    backgroundColor: "#f08a16",
    width: "132px",
    showLogo: true,
    logoColor: "#ffffff",
  },
  headerSettings: {
    backgroundColor: "#14365a",
    textColor: "#ffffff",
    fontFamily: "Inter, system-ui, sans-serif",
    stickyHeader: true,
    menuItems: [
      { label: "Home", link: "#" },
      { label: "Ministries", link: "#ministries" },
      { label: "Updates", link: "#updates" },
    ],
    ctaButton: {
      text: "Give Now",
      link: "#support",
      backgroundColor: "#0b6f7d",
      textColor: "#ffffff",
      borderRadius: 0,
      padding: "12px 18px",
    },
  },
  footerSettings: {
    backgroundColor: "#031c39",
    textColor: "#d2dbea",
    description:
      "Seventh-day Adventist Church in Papua New Guinea, proclaiming everlasting hope through worship, education, health, media, and service.",
    copyrightText: "© Papua New Guinea Union Mission",
    footerLinks: [
      { label: "Who We Are", link: "#" },
      { label: "Leadership", link: "#" },
      { label: "Find a Church", link: "#" },
    ],
  },
  sections: [
    {
      sectionName: "hero",
      displayOrder: 1,
      isActive: true,
      subtitle: "SEVENTH-DAY ADVENTIST CHURCH - PAPUA NEW GUINEA UNION MISSION",
      title: "Serving God's People|Across the Islands",
      description:
        "Proclaiming the everlasting gospel through worship, education, health, media, and community service across Papua New Guinea and the Pacific Islands.",
      buttonSettings: {
        text: "OUR MINISTRIES",
        link: "#ministries",
        backgroundColor: "#f08a16",
        textColor: "#ffffff",
      },
      secondaryButtonSettings: {
        text: "LATEST UPDATES",
        link: "#updates",
        backgroundColor: "transparent",
        textColor: "#ffffff",
      },
    },
    {
      sectionName: "about",
      displayOrder: 2,
      isActive: true,
      subtitle: "OUR MISSION",
      title: "To make disciples of all nations, baptising them in the name of the Father, Son, and Holy Spirit.",
      description:
        "PNGUM supports local churches, schools, hospitals, media ministries, and relief work so every province can encounter practical hope in Jesus.",
      statItems: [
        { value: "250,000+", label: "CHURCH MEMBERS" },
        { value: "1,200+", label: "CONGREGATIONS" },
      ],
    },
  ],
};

async function ensurePermission(permissionQuery, role, action) {
  if (!role) return;
  const existing = await permissionQuery.findOne({ where: { role: role.id, action } });
  if (!existing) {
    await permissionQuery.create({ data: { role: role.id, action, enabled: true } });
    return;
  }

  if (existing.enabled !== true) {
    await permissionQuery.update({
      where: { id: existing.id },
      data: { enabled: true },
    });
  }
}

async function ensurePortalPermissions(strapi) {
  const roleQuery = strapi.db.query("plugin::users-permissions.role");
  const permissionQuery = strapi.db.query("plugin::users-permissions.permission");
  const publicRole = await roleQuery.findOne({ where: { type: "public" } });
  const authenticatedRole = await roleQuery.findOne({ where: { type: "authenticated" } });

  await ensurePermission(permissionQuery, publicRole, "api::home-page.home-page.find");
  await ensurePermission(permissionQuery, publicRole, "plugin::users-permissions.auth.callback");
  await ensurePermission(permissionQuery, authenticatedRole, "api::home-page.home-page.find");
  await ensurePermission(permissionQuery, authenticatedRole, "api::home-page.home-page.update");
  await ensurePermission(permissionQuery, authenticatedRole, "plugin::users-permissions.user.me");
  await ensurePermission(permissionQuery, authenticatedRole, "plugin::upload.content-api.find");
  await ensurePermission(permissionQuery, authenticatedRole, "plugin::upload.content-api.findOne");
  await ensurePermission(permissionQuery, authenticatedRole, "plugin::upload.content-api.upload");
}

async function seedHomePage(strapi) {
  const existing = await strapi.db.query("api::home-page.home-page").findOne();
  if (existing) return;

  await strapi.documents("api::home-page.home-page").create({
    data: defaultHomePage,
    status: "published",
  });
}

async function ensurePortalUser(strapi) {
  const roleQuery = strapi.db.query("plugin::users-permissions.role");
  const userQuery = strapi.db.query("plugin::users-permissions.user");
  const authenticatedRole = await roleQuery.findOne({ where: { type: "authenticated" } });
  if (!authenticatedRole) return null;

  const email = process.env.PORTAL_USER_EMAIL || "clientadmin@local.test";
  const username = process.env.PORTAL_USER_NAME || "clientadmin";
  const password = process.env.PORTAL_USER_PASSWORD || "Client@1234";

  const existingUser = await userQuery.findOne({
    where: {
      $or: [{ email }, { username }],
    },
  });

  if (existingUser) return existingUser;

  const userService = strapi.plugin("users-permissions").service("user");
  const created = await userService.add({
    email,
    username,
    password,
    provider: "local",
    confirmed: true,
    blocked: false,
    role: authenticatedRole.id,
  });

  strapi.log.info(`Portal user created: ${email}`);
  return created;
}

module.exports = {
  register() {},
  async bootstrap({ strapi }) {
    try {
      await ensurePortalPermissions(strapi);
      await seedHomePage(strapi);
      await ensurePortalUser(strapi);
    } catch (error) {
      strapi.log.warn(`Portal bootstrap warning: ${error.message}`);
    }
  },
};
