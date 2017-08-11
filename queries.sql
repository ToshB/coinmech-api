CREATE TABLE "public"."players" (
    "id" serial,
    "name" text,
    "email" text,
    "cardId" text,
    "balance" numeric(15,2),
    PRIMARY KEY ("id")
);

INSERT INTO "public"."players"("name", "email", "cardId", "balance") VALUES('Torstein', 'tosh@tosh.no', '1234', 0) RETURNING "id", "name", "email", "cardId", "balance";
