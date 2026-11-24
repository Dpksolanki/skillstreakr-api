import { eq, sql } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { users, type User } from "../../../db/schema/index.js";

class UsersRepository {
  async findById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  // lower(email) matches the unique index users_email_lower_unique, so this lookup uses it.
  async findByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(sql`lower(${users.email}) = ${email.toLowerCase()}`)
      .limit(1);
    return user;
  }
}

export default UsersRepository;
