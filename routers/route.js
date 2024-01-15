const express = require("express");
const router = express.Router();
const auth = require("../meddleware/auth");
const fileupload = require("express-fileupload");
// router.use(fileupload());

const addContact = require("../controlers/addContact");
const deleteChat = require("../controlers/deleteChat");
const deleteAllChat = require("../controlers/deleteAllChat");
const getGroupChatMsg = require("../controlers/getGroupChatMsg");
const loginControler = require("../controlers/loginControler");
const findCommonGroup = require("../controlers/findCommonGroup");
const signinControler = require("../controlers/signinControler");
const searchControler = require("../controlers/searchControler");
const getSingleChatMsg = require("../controlers/getSingleChatMsg");
const newSingleMessage = require("../controlers/newSingleMessage");
const newGrouopMessage = require("../controlers/newGrouopMessage");
const findUserByNumber = require("../controlers/findUserByNumber");
const getGroupControler = require("../controlers/getGroupControler");
const getusercredential = require("../controlers/getusercredential");
const changeNameControler = require("../controlers/changeNameControler");
const createGroupControler = require("../controlers/createGroupControler");
const changeAboutControler = require("../controlers/changeAboutControler");
const changePhoneControler = require("../controlers/changePhoneControler");
const getallcontactControler = require("../controlers/getallcontactControler");

router.get("/createuser/login", loginControler);
router.get("/contact/searchuser", auth, searchControler);
router.get("/contact/getGroups", auth, getGroupControler);
router.get("/getusercredential", auth, getusercredential);
router.get("/getallcontacts", auth, getallcontactControler);
router.get("/contact/findCommonGroup", auth, findCommonGroup);
router.get("/contact/findUserByNumber", auth, findUserByNumber);
router.get("/contact/getSingleChatMsg", auth, getSingleChatMsg);
router.get("/contact/getGroupChatMsg", auth, getGroupChatMsg);

router.post("/createuser/signin", signinControler);
router.post("/contact/addcontact", auth, addContact);
router.post("/contact/createGroup", auth, createGroupControler);
router.post("/contact/newSingleMessage", auth, newSingleMessage);
router.post("/contact/newGrouopMessage", auth, newGrouopMessage);

router.delete("/contact/deleteChat", auth, deleteChat);
router.delete("/contact/deleteAllChat", auth, deleteAllChat);

router.put("/contact/update/name", auth, changeNameControler);
router.put("/contact/update/about", auth, changeAboutControler);
router.put("/contact/update/phone", auth, changePhoneControler);

router.all("*", (req, res) => res.status(404).send("not found"));

module.exports = router;
