import { connect } from 'mongoose';

let isConnected = false;

export const connectToDatabase = async (): Promise<void> => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return;
  }

  console.log('=> using new database connection');
  const db = await connect(process.env.DB!);
  isConnected = Boolean(db.connections[0].readyState);
};
