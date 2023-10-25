import { MonitorResponse } from "@/helpers/monitor.helpers";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Get Monitor data as returned by the Wiener Linien API
 */
export default async function getMonitor(
  req: NextApiRequest,
  res: NextApiResponse<MonitorResponse | { error: string }>
) {
  try {
    const query = (req.query.id as string)
      .split(",")
      .map((id) => `diva=${id}`)
      .join("&");
    const reqUrl = `https://www.wienerlinien.at/ogd_realtime/monitor?${query}`;
    const result: MonitorResponse = (await (
      await fetch(reqUrl)
    ).json()) as MonitorResponse;
    if (result?.message?.value !== "OK") {
      console.error(result);
      return res.status(500).json({ error: "internal error" });
    }
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "internal error" });
  }
}
