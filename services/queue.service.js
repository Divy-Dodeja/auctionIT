const Queue = require("bull");
const eventService = require("./event.service");
const domainService = require("./domain.service");

const DomainQueue = new Queue("DomainQueue", {
  redis: {
    host: "redis-server",
  },
});

eventService.on("domain-create", (data) => {
  DomainQueue.add(data);
});

DomainQueue.process(async (job, done) => {
  domain = job.data.domain;
  domainService
    .domainWhoisValidation(domain._id)
    .then((data) => {
      done();
    })
    .catch((err) => {
      console.log("[ERROR][QUEUE]", err);
    });
});
