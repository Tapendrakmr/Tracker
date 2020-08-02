const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./bigscalTracker.db",
  },
  useNullAsDefault: true,
});

const Initialise = () => {
  return knex.schema.hasTable("TrackerTable").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("TrackerTable", (table) => {
        table.increments("id").primary();
        table.string("userId");
        table.string("projectId");
        table.string("sessionDate");
        table.string("sessionStartTime");
        table.string("FullImagePath");
        table.string("ThumbimagePath");
        table.integer("ImageName");
        table.string("Uploded");
        table.string("FullImageKey");
        table.string("ThumbKey");
      });
    } else {
      console.log("table already created");
      return "Table Already Exist";
    }
  });
};
const InsertData = async (data) => {
  var result = await knex("TrackerTable").insert({
    userId: data.userId,
    projectId: data.projectId,
    sessionDate: data.sessionDate,
    sessionStartTime: data.sessionStartTime,
    FullImagePath: data.FullImagePath,
    ThumbimagePath: data.ThumbimagePath,
    ImageName: Number(data.ImageName),
    Uploded: data.Uploded,
    FullImageKey: data.FullImageKey,
    ThumbKey: data.ThumbKey,
  });
  if (result) {
    console.log(result);
    return "Inserted SuccessFully";
  } else {
    return "errr";
  }
};
// const searchAll = async () => {
//   var result = await knex.select().table("TrackerTable");
//   return result;
//   // console.log(result);
// };
const SearchAllUnsendData = async () => {
  // var resultInfo = await knex.select().table("TrackerTable");

  var resultInfo = await knex("TrackerTable").where("Uploded", false);
  console.log("result");
  console.log(resultInfo);
  return resultInfo;
};
const UpdateRecord = async (data) => {
  console.log("upadte valu");
  console.log(data);
  var resultInfo = await knex("TrackerTable")
    .where({ ImageName: data.ImageName })
    .update({
      Uploded: data.Uploded,
      FullImageKey: data.FullImageKey,
      ThumbKey: data.ThumbKey,
    });

  return resultInfo;
};
const DeleteEntry = async () => {
  var result = await knex.schema.dropTable("TrackerTable");
  console.log("deleted value");
  ss;
  console.log(result);
  return result;
};

module.exports = {
  Initialise,
  InsertData,
  SearchAllUnsendData,
  // searchAll,
  UpdateRecord,
  DeleteEntry,
};
