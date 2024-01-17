const azureStorage = require("azure-storage");
const { QueueServiceClient } = require("@azure/storage-queue");
const connectionString =
  "DefaultEndpointsProtocol=https;AccountName=ambrosiaalertstorage;AccountKey=rwWTRwFJgtuSVOJikQMJUfyIFFKL172jcVYDS99AIHcO3KIFxNYaPKUAfCUqJqUfnNMwR+neA58a+ASt720Rzw==;EndpointSuffix=core.windows.net";
const tableService = azureStorage.createTableService(connectionString);
console.log("Conectat la serviciul de tabel cu succes.");
const tableNameUsers = "users";
const tableNameRiskZones = "ambrosiatable";
const queueName = "messsages";

function getUsers() {
  return new Promise((resolve, reject) => {
    const query = new azureStorage.TableQuery();
    tableService.queryEntities(
      tableNameUsers,
      query,
      null,
      (error, result, response) => {
        if (!error) {
          const users = result.entries;
          console.log("Utilizatori obținuți cu succes:", users);
          resolve(users);
        } else {
          console.error("Eroare la obținerea utilizatorilor:", error);
          reject(error);
        }
      }
    );
  });
}

function getRiskZones() {
  return new Promise((resolve, reject) => {
    const query = new azureStorage.TableQuery();
    tableService.queryEntities(
      tableNameRiskZones,
      query,
      null,
      (error, result, response) => {
        if (!error) {
          const riskZones = result.entries;
          resolve(riskZones);
        } else {
          reject(error);
        }
      }
    );
  });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const radianLat1 = toRadians(lat1);
  const radianLon1 = toRadians(lon1);
  const radianLat2 = toRadians(lat2);
  const radianLon2 = toRadians(lon2);

  const deltaLat = radianLat2 - radianLat1;
  const deltaLon = radianLon2 - radianLon1;

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(radianLat1) * Math.cos(radianLat2) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const radiusOfEarth = 6371;
  const distance = radiusOfEarth * c;

  return distance;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

const thresholdDistance = 5;

function addToNotificationQueue() {
  const queueServiceClient =
    QueueServiceClient.fromConnectionString(connectionString);
  const queueClient = queueServiceClient.getQueueClient(queueName);

  const message = {
    messageText: "Attention! You are in a high-risk allergy zone.",
  };

  return queueClient.sendMessage(JSON.stringify(message));
}

function processDistanceAndNotifications() {
  getUsers()
    .then((users) => {
      return getRiskZones().then((riskZones) => ({ users, riskZones }));
    })
    .then(({ users, riskZones }) => {
      console.log("Utilizatori obținuți:", users);

      for (const user of users) {
        for (const zone of riskZones) {
          const distance = calculateDistance(
            user.Latitude,
            user.Longitude,
            zone.latitude,
            zone.longitude
          );
          console.log("Distanța este: ${distance} km");
          if (distance < thresholdDistance) {
            return addToNotificationQueue();
          }
        }
      }

      console.log("Distanțe calculate și notificări adăugate cu succes.");
    })
    .catch((error) => {
      console.error(
        "Eroare în procesul de calculare distanță și adăugare notificări:",
        error
      );
    });
}

processDistanceAndNotifications();
