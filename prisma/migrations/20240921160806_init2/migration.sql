/*
  Warnings:

  - Added the required column `idProfile` to the `Movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idRepeatable` to the `Movement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movement" ADD COLUMN     "idLoseType" INTEGER,
ADD COLUMN     "idProfile" INTEGER NOT NULL,
ADD COLUMN     "idRepeatable" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "idAvatar" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "total" SET DEFAULT 0.0;

-- AlterTable
ALTER TABLE "Repeatable" ALTER COLUMN "everyDate" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "fk_movement_movement" FOREIGN KEY ("idRepeatable") REFERENCES "Repeatable"("idRepeatable") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "fk_movement_losetype" FOREIGN KEY ("idLoseType") REFERENCES "LoseType"("idLoseType") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "fk_movement_profile" FOREIGN KEY ("idProfile") REFERENCES "Profile"("idProfile") ON DELETE CASCADE ON UPDATE NO ACTION;
