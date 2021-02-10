import request from "superagent";
import { v4 } from "uuid";
import { observable, action } from "mobx";
import jsCookie from "js-cookie";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:${process.env.PORT}/${process.env.SUB_DOMAIN}/api`
    : `https://chatbot.xymion.nl/${process.env.SUB_DOMAIN}/api`;
const COOKIE_NAME = "IDENTIFICATION";
const MESSAGE_DELAY = process.env.NODE_ENV === "development" ? 0 : Math.floor(1000 + 750 * Math.random());
const TIMEOUT = process.env.NODE_ENV === "development" ? 0 : 2000;

class Store {
  @observable feed = [];
  @observable page = "bot";
  @observable surveyAvailable = false;
  @observable surveyEnabled = false;
  @observable botTyping = false;
  @observable conversationTerminated = false;
  @observable contexts = [];

  @action identify = async () => {
    let cookie = this.getCookie();
    if (!cookie) {
      const response = await request.post(`${API_BASE_URL}/v1/authenticate`);
      cookie = response.body.data;
      jsCookie.set(COOKIE_NAME, cookie, {
        expires: 1000 * 60 * 60 * 24 * 300,
        path: "",
      });
    }
    await request.post(`${API_BASE_URL}/v1/newPreferenceSession`).send({ cookie: this.getCookie() });
  };

  @action updateSonaID = async (sonaID) => {
    await request.post(`${API_BASE_URL}/v1/updateSonaID`).send({ cookie: this.getCookie(), sonaID: sonaID });
  };

  @action setBotTyping = (value) => (this.botTyping = value);

  @action getCookie = () => {
    return jsCookie.get(COOKIE_NAME);
  };

  @action pushMessageToFeed = (message, position) => {
    this.feed.push({ id: v4(), text: message, position });
  };

  @action setSurveyAvailable = (value) => {
    this.surveyAvailable = value;
  };

  @action setPage = (page) => {
    this.page = page;
  };

  @action retrieveWelcomeMessage = async () => {
    const response = await request
      .get(`${API_BASE_URL}/v1/chat/welcome`)
      .query({ sessionId: this.getCookie() })
      .send();

    const { contexts, messages } = response.body;

    this.contexts = (contexts || []).map((context) => ({
      name: context.name,
      lifespan: 1,
    }));

    if (messages.length) {
      this.botTyping = true;
      for (const message of messages) {
        if (message.speech && !message.platform) {
          await this.showMessageWithDelay(message.speech);
        }
      }
      this.botTyping = false;
    }
  };

  @action showMessageWithDelay = (speech) =>
    new Promise((resolve, _) => {
      setTimeout(() => {
        this.pushMessageToFeed(speech, "left");
        resolve();
      }, MESSAGE_DELAY);
    });

  @action sendMessage = async (text) => {
    this.pushMessageToFeed(text, "right");
    setTimeout(async () => {
      this.botTyping = true;
      const response = await request
        .post(`${API_BASE_URL}/v1/chat`)
        .query({ sessionId: this.getCookie() })
        .send({ contexts: this.contexts, message: text });

      const { contexts, messages, isGoodbye } = response.body;

      if (isGoodbye) {
        this.conversationTerminated = true;
      }

      this.contexts = (contexts || []).map((context) => ({
        name: context.name,
        lifespan: 1,
      }));

      if (messages) {
        this.botTyping = true;
        for (const message of messages) {
          if (message.speech && !message.platform) {
            await this.showMessageWithDelay(message.speech);
          }
        }
        this.botTyping = false;
      }
    }, TIMEOUT);
  };
}

const store = new Store();

export default store;
