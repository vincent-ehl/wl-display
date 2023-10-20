// import { useEffect, useState } from "react";

// export abstract class AbstractSingleton {
//   protected notifyHandlers = new Map<string, () => void>();
//   public hasNotified = false;

//   public notify(notifyIds?: string[]): void {
//     this.hasNotified = true;

//     this.notifyHandlers.forEach((handler, notifyId) => {
//       if (!notifyIds || notifyIds.includes(notifyId)) {
//         handler();
//       }
//     });
//   }

//   public addNotifyHandler(handlerId: string, notifyHandler: () => void): void {
//     this.notifyHandlers.set(handlerId, notifyHandler);
//   }

//   public removeNotifyHandler(handlerId: string): void {
//     this.notifyHandlers.delete(handlerId);
//   }
// }

// export const useSingleton = <T extends AbstractSingleton>(
//   singleton: T,
//   notifyId?: string
// ): void => {
//   const [, setState] = useState({});

//   useEffect(() => {
//     const nId = notifyId || Math.random().toString();

//     singleton.addNotifyHandler(nId, () => {
//       setState({});
//     });

//     return () => {
//       singleton.removeNotifyHandler(nId);
//     };
//   }, [singleton, notifyId]);
// };
