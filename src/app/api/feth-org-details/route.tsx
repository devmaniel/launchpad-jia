import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { orgID } = await req.json();

    console.log("feth-org-details: Received orgID:", orgID);

    if (!orgID) {
      return Response.json(
        { error: "Missing orgID parameter" },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();

    // Try to convert orgID to ObjectId if possible, else use as string
    let query;
    try {
      query = { _id: new ObjectId(orgID) };
      console.log("feth-org-details: Using ObjectId query:", query);
    } catch (e) {
      query = { _id: orgID };
      console.log("feth-org-details: Using string query:", query);
    }

    // First, let's check if the organization exists at all
    const orgExists = await db.collection("organizations").findOne(query);
    console.log("feth-org-details: Organization exists:", !!orgExists);

    if (!orgExists) {
      // Try alternative queries
      const altQuery1 = { orgID: orgID };
      const altQuery2 = { _id: orgID.toString() };
      
      const altOrg1 = await db.collection("organizations").findOne(altQuery1);
      const altOrg2 = await db.collection("organizations").findOne(altQuery2);
      
      console.log("feth-org-details: Alternative queries:", {
        altQuery1: !!altOrg1,
        altQuery2: !!altOrg2
      });
      
      if (altOrg1) query = altQuery1;
      else if (altOrg2) query = altQuery2;
    }

    const orgDoc = await db.collection("organizations").aggregate([
      {
        $match: query
      },
      {
        $lookup: {
            from: "organization-plans",
            let: { planId: "$planId" },
            pipeline: [
                {
                    $addFields: {
                        _id: { $toString: "$_id" }
                    }
                },
                {
                    $match: {
                        $expr: { $eq: ["$_id", "$$planId"] }
                    }
                }
            ],
            as: "plan"
        }
    },
    {
      $unwind: {
        path: "$plan",
        preserveNullAndEmptyArrays: true
      }
    },
    ]).toArray();

    console.log("feth-org-details: Found organizations:", orgDoc.length);

    if (!orgDoc || orgDoc.length === 0) {
      return Response.json(
        { error: "Organization not found", orgID, query },
        { status: 404 }
      );
    }

    console.log("feth-org-details: Returning org data with plan:", !!orgDoc[0].plan);
    return Response.json(orgDoc[0]);
  } catch (error) {
    console.error("Error in feth-org-details endpoint:", error);
    return Response.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
