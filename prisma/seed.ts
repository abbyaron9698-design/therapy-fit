// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { PROVIDERS } from "../lib/providerData.generated";

const prisma = new PrismaClient();

async function main() {
  for (const p of PROVIDERS) {
    await prisma.provider.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        name: p.name,
        address: p.address,
        city: p.city,
        state: p.state,
        zip: p.zip,
        telehealth: p.telehealth,
        acceptingNewClients: p.acceptingNewClients,
        insurance: p.insurance,     // Json
        modalities: p.modalities,   // Json
        website: p.website ?? null,
        parkingUrl: p.parkingUrl ?? null,
        notes: p.notes ?? null,
        sourceUrl: p.sourceUrl ?? null,
      },
      update: {
        name: p.name,
        address: p.address,
        city: p.city,
        state: p.state,
        zip: p.zip,
        telehealth: p.telehealth,
        acceptingNewClients: p.acceptingNewClients,
        insurance: p.insurance,
        modalities: p.modalities,
        website: p.website ?? null,
        parkingUrl: p.parkingUrl ?? null,
        notes: p.notes ?? null,
        sourceUrl: p.sourceUrl ?? null,
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
