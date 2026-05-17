import mkcert from "mkcert";
import fs from "fs";

async function createCert() {
  // Create a Certificate Authority
  const ca = await mkcert.createCA({
    organization: "Local Dev CA",
    countryCode: "US",
    state: "Local",
    locality: "Local",
    validity: 365
  });

  // Create your HTTPS cert
  const cert = await mkcert.createCert({
    domains: ["localhost"],
    validity: 365,
    ca: {
      key: ca.key,
      cert: ca.cert
    }
  });

  fs.writeFileSync("cert.pem", cert.cert);
  fs.writeFileSync("key.pem", cert.key);

  console.log("✔ Certificates generated: cert.pem + key.pem");
}

createCert();
