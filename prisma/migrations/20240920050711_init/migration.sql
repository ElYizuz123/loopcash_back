-- CreateTable
CREATE TABLE "Movement" (
    "idGanancia" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "isGoal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Movement_pkey" PRIMARY KEY ("idGanancia")
);

-- CreateTable
CREATE TABLE "Profile" (
    "idProfile" SERIAL NOT NULL,
    "user" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("idProfile")
);

-- CreateTable
CREATE TABLE "Repeatable" (
    "idRepeatable" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "everyDate" DATE NOT NULL,

    CONSTRAINT "Repeatable_pkey" PRIMARY KEY ("idRepeatable")
);

-- CreateTable
CREATE TABLE "LoseType" (
    "idLoseType" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LoseType_pkey" PRIMARY KEY ("idLoseType")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_user_key" ON "Profile"("user");
