const { tbl_topics_helpdesks, tbl_sub_topics_helpdesks, tbl_question_helpdesks, tbl_question_fors, tbl_question_likes, tbl_companys, tbl_department_positions, tbl_structure_departments, tbl_users, tbl_account_details, tbl_s } = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const logError = require('../helpers/logError')

class helpdesk {
  static async createTopics(req, res) {
    try {
      let newData = {
        topics: req.body.topics,
        order: req.body.order,
        user_id: req.user.user_id
      }

      if (req.file) newData.icon = req.file.path

      let data = await tbl_topics_helpdesks.create(newData)

      res.setHeader('Cache-Control', 'no-cache');
      res.status(201).json({ message: 'Success', data })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/helpdesk/topics`,
        method: 'post',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err });
      console.log(err)
    }
  }

  static async getAllTopics(req, res) {
    try {
      let tempConditionPT = [], conditionPT = {}, tempConditionDepartment = [], conditionDepartment = {}, condition
      if (req.user.user_id !== 1) {
        let userAccount = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })
        let dataPosition = await tbl_department_positions.findAll({ where: { user_id: req.user.user_id }, include: [{ model: tbl_structure_departments }] })

        tempConditionPT.push({
          [Op.and]: [
            { '$tbl_sub_topics_helpdesks.tbl_question_helpdesks.tbl_question_fors.option$': 'company' },
            { '$tbl_sub_topics_helpdesks.tbl_question_helpdesks.tbl_question_fors.company_id$': userAccount.company_id },
          ]
        })

        dataPosition.length > 0 && await dataPosition.forEach(position => {
          tempConditionPT.push({
            [Op.and]: [
              { '$tbl_sub_topics_helpdesks.tbl_question_helpdesks.tbl_question_fors.option$': 'company' },
              { '$tbl_sub_topics_helpdesks.tbl_question_helpdesks.tbl_question_fors.company_id$': position.tbl_structure_department.company_id },
            ]
          })

          tempConditionDepartment.push({
            [Op.and]: [
              { '$tbl_sub_topics_helpdesks.tbl_question_helpdesks.tbl_question_fors.option$': 'department' },
              { '$tbl_sub_topics_helpdesks.tbl_question_helpdesks.tbl_question_fors.departments_id$': position.tbl_structure_department.departments_id },
            ]
          })
        })

        conditionPT = { [Op.or]: tempConditionPT }
        conditionDepartment = { [Op.or]: tempConditionDepartment }

        condition = {
          [Op.or]: [
            {
              user_id: req.user.user_id
            },
            { '$tbl_sub_topics_helpdesks.tbl_question_helpdesks.tbl_question_fors.option$': 'all' },
            {
              [Op.and]: [
                { '$tbl_sub_topics_helpdesks.tbl_question_helpdesks.tbl_question_fors.option$': 'employee' },
                { '$tbl_sub_topics_helpdesks.tbl_question_helpdesks.tbl_question_fors.user_id$': req.user.user_id },
              ]
            },
            conditionPT,
            conditionDepartment
          ]
        }
      }

      let data = await tbl_topics_helpdesks.findAll({
        include: [
          {
            model: tbl_sub_topics_helpdesks,
            include: [
              {
                model: tbl_question_helpdesks,
                include: [
                  {
                    model: tbl_question_fors,
                  }
                ],
                order: [
                  ['order', 'ASC']
                ],
              }
            ],
          }
        ],
        order: [
          ['order', 'ASC'],
          // ['id', 'ASC']
        ],
        where: condition
      })

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: 'Success', data })

    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/helpdesk/topics`,
        method: 'get',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err });
      console.log(err)
    }

  }

  static async getOneTopics(req, res) {
    try {
      let data = await tbl_topics_helpdesks.findByPk(req.params.id, {
        include: [
          {
            model: tbl_sub_topics_helpdesks,
            include: [
              {
                model: tbl_question_helpdesks,
                include: [
                  {
                    model: tbl_question_fors
                  }, {
                    model: tbl_question_likes
                  }
                ]
              }
            ],
          }
        ],
        order: [
          [tbl_sub_topics_helpdesks, 'order', 'ASC'],
          [tbl_sub_topics_helpdesks, tbl_question_helpdesks, 'order', 'ASC']
        ],
      })

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: 'Success', data })

    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/helpdesk/topics/${req.params.id}`,
        method: 'get',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err });
      console.log(err)
    }
  }

  static async updateTopics(req, res) {
    try {
      let newData = {
        topics: req.body.topics,
        order: req.body.order
      }

      if (req.file) newData.icon = req.file.path

      let data = await tbl_topics_helpdesks.update(newData, { where: { id: req.params.id } })

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: 'Success', data })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/helpdesk/topics/${req.params.id}`,
        method: 'put',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err });
      console.log(err)
    }
  }

  static async deleteTopics(req, res) {
    try {
      await tbl_topics_helpdesks.destroy({ where: { id: req.params.id } })

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: 'Success' })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/helpdesk/topics/${req.params.id}`,
        method: 'delete',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err });
      console.log(err)
    }
  }










  // SUB TOPICS
  static async updateSubTopics(req, res) {
    try {
      let data = await tbl_sub_topics_helpdesks.update({ sub_topics: req.body.subTopics }, { where: { id: req.params.id } })

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: 'Success', data })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/helpdesk/sub-topics/${req.params.id}`,
        method: 'put',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err });
      console.log(err)
    }
  }

  static async deleteSubTopics(req, res) {
    try {
      await tbl_sub_topics_helpdesks.destroy({ where: { id: req.params.id } })

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: 'Success' })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/helpdesk/topics/${req.params.id}`,
        method: 'delete',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err });
      console.log(err)
    }
  }

  static async updateOrderSubTopics(req, res) {
    try {
      let subTopicsSelected = await tbl_sub_topics_helpdesks.findOne({ where: { id: req.params.id } })

      let oldOrder = subTopicsSelected.order, newOrder = req.body.order === 'up' ? +subTopicsSelected.order - 1 : +subTopicsSelected.order + 1

      let subTopicsForChangeOrder = await tbl_sub_topics_helpdesks.findOne({ where: { topics_id: +req.body.topics_id, order: newOrder } })

      await tbl_sub_topics_helpdesks.update({ order: newOrder }, { where: { id: req.params.id } })
      await tbl_sub_topics_helpdesks.update({ order: oldOrder }, { where: { id: subTopicsForChangeOrder.id } })

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: 'Success' })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/helpdesk/sub-topics/${req.params.id}`,
        method: 'put',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err });
      console.log(err)
    }
  }








  // QUESTION
  static async createQuestion(req, res) {
    try {
      let newDataQuestion = {
        question: req.body.question,
        answer: req.body.editorState,
        user_id: req.user.user_id,
        help: req.body.help
      }

      let lastRecordQuestion = await tbl_question_helpdesks.findOne({ order: [['order', 'DESC']] })
      let lastRecordSubTopics = await tbl_sub_topics_helpdesks.findOne({ order: [['order', 'DESC']] })

      if (isNaN(req.body.subTopik)) { // CHECK AVAILABLE CUB TOPICS
        let newSubTopics = {
          sub_topics: req.body.subTopik,
          topics_id: req.body.topicsId,
          user_id: req.user.user_id,
          order: lastRecordSubTopics.order++
        }
        let dataSubTopics = await tbl_sub_topics_helpdesks.create(newSubTopics)
        newDataQuestion.sub_topics_id = dataSubTopics.id
      } else {
        newDataQuestion.sub_topics_id = req.body.subTopik
      }

      newDataQuestion.order = lastRecordQuestion.order++
      let dataQuestionHelpdesk = await tbl_question_helpdesks.create(newDataQuestion)


      if (req.body.inviteOption === 'all') {
        let newData = {
          question_id: dataQuestionHelpdesk.id,
          option: 'all'
        }
        await tbl_question_fors.create(newData)
      } else if (req.body.inviteOption === 'company') {
        await req.body.company.forEach(async (element) => {
          let newData = {
            question_id: dataQuestionHelpdesk.id,
            option: 'company',
            company_id: element.company_id
          }
          await tbl_question_fors.create(newData)
        });
      } else if (req.body.inviteOption === 'department') {
        await req.body.department.forEach(async (element) => {
          let newData = {
            question_id: dataQuestionHelpdesk.id,
            option: 'department',
            departments_id: element.departments_id
          }
          await tbl_question_fors.create(newData)
        });
      } else if (req.body.inviteOption === 'employee') {
        await req.body.employee.forEach(async (element) => {
          let newData = {
            question_id: dataQuestionHelpdesk.id,
            option: 'employee',
            user_id: element.value
          }
          await tbl_question_fors.create(newData)
        });
      }

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: 'Success', data: dataQuestionHelpdesk })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/helpdesk/question`,
        method: 'post',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err });
      console.log(err)
    }
  }

  static async updateQuestion(req, res) {
    try {
      let newDataQuestion = {
        question: req.body.question,
        answer: req.body.editorState,
        help: req.body.help
      }
      await tbl_question_helpdesks.update(newDataQuestion, { where: { id: req.params.id } })

      let checkQuestionFor = await tbl_question_fors.findAll({ where: { question_id: req.params.id } })
      if (req.body.inviteOption === (checkQuestionFor.length > 0 && checkQuestionFor[0].option)) {
        if (req.body.inviteOption === 'company') {
          await checkQuestionFor.forEach(async (checkQuestionFor) => {
            let checkAvaiable = req.body.company.find(el => el.company_id === checkQuestionFor.company_id)
            if (!checkAvaiable) await tbl_question_fors.destroy({ where: { id: checkQuestionFor.id } })
          })

          await req.body.company.forEach(async (option) => {
            let checkAvaiable = checkQuestionFor.find(el => el.company_id === option.company_id)
            if (!checkAvaiable) {
              let newData = {
                question_id: req.params.id,
                option: 'company',
                company_id: element.company_id
              }
              await tbl_question_fors.create(newData)
            }
          })
        } else if (req.body.inviteOption === 'department') {
          await checkQuestionFor.forEach(async (checkQuestionFor) => {
            let checkAvaiable = req.body.department.find(el => el.departments_id === checkQuestionFor.departments_id)
            if (!checkAvaiable) await tbl_question_fors.destroy({ where: { id: checkQuestionFor.id } })
          })

          await req.body.department.forEach(async (option) => {
            let checkAvaiable = checkQuestionFor.find(el => el.departments_id === option.departments_id)
            if (!checkAvaiable) {
              let newData = {
                question_id: req.params.id,
                option: 'department',
                departments_id: element.departments_id
              }
              await tbl_question_fors.create(newData)
            }
          })
        } else if (req.body.inviteOption === 'employee') {
          await checkQuestionFor.forEach(async (checkQuestionFor) => {
            let checkAvaiable = req.body.employee.find(el => el.value === checkQuestionFor.user_id)
            if (!checkAvaiable) await tbl_question_fors.destroy({ where: { id: checkQuestionFor.id } })
          })

          await req.body.employee.forEach(async (option) => {
            let checkAvaiable = checkQuestionFor.find(el => el.user_id === option.value)
            if (!checkAvaiable) {
              let newData = {
                question_id: req.params.id,
                option: 'employee',
                user_id: option.value
              }
              await tbl_question_fors.create(newData)
            }
          })
        }
      } else {
        if (checkQuestionFor.length > 0) await tbl_question_fors.destroy({ where: { question_id: req.params.id } })

        if (req.body.inviteOption === 'all') {
          let newData = {
            question_id: dataQuestionHelpdesk.id,
            option: 'all'
          }
          await tbl_question_fors.create(newData)
        } else if (req.body.inviteOption === 'company') {
          await req.body.company.forEach(async (element) => {
            let newData = {
              question_id: dataQuestionHelpdesk.id,
              option: 'company',
              company_id: element.company_id
            }
            await tbl_question_fors.create(newData)
          });
        } else if (req.body.inviteOption === 'department') {
          await req.body.department.forEach(async (element) => {
            let newData = {
              question_id: dataQuestionHelpdesk.id,
              option: 'department',
              departments_id: element.departments_id
            }
            await tbl_question_fors.create(newData)
          });
        } else if (req.body.inviteOption === 'employee') {
          await req.body.employee.forEach(async (element) => {
            let newData = {
              question_id: dataQuestionHelpdesk.id,
              option: 'employee',
              user_id: element.value
            }
            await tbl_question_fors.create(newData)
          });
        }
      }

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: 'Success' })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/helpdesk/question/${req.params.id}`,
        method: 'put',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err });
      console.log(err)
    }
  }

  static async deleteQuestion(req, res) {
    try {
      await tbl_question_helpdesks.destroy({ where: { id: req.params.id } })

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: 'Success' })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/helpdesk/question/${req.params.id}`,
        method: 'delete',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err });
      console.log(err)
    }
  }

  static async likeUnlikeQuestion(req, res) {
    try {
      let questionLike = await tbl_question_likes.findOne({ where: { question_id: req.params.id, user_id: req.user.user_id } })
      if (questionLike) {
        if (!req.body.like && !req.body.unlike) {
          await tbl_question_likes.destroy({ where: { id: questionLike.id } })
        } else {
          await tbl_question_likes.update({ like: req.body.like, unlike: req.body.unlike }, { where: { id: questionLike.id } })
        }
      } else {
        await tbl_question_likes.create({ question_id: req.params.id, like: req.body.like, unlike: req.body.unlike, user_id: req.user.user_id })
      }

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: 'Success' })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/helpdesk/question/like/${req.params.id}`,
        method: 'put',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err });
      console.log(err)
    }
  }

  static async getLikeUnlikeQuestion(req, res) {
    try {
      let questionLike = await tbl_question_likes.findOne({ where: { question_id: req.params.id, user_id: req.user.user_id } })

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: 'Success', data: questionLike })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/helpdesk/question/like/${req.params.id}`,
        method: 'put',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err });
      console.log(err)
    }
  }

  static async updateOrderSubTopics(req, res) {
    try {
      let questionSelected = await tbl_question_helpdesks.findOne({ where: { id: req.params.id } })

      let oldOrder = questionSelected.order, newOrder = req.body.order === 'up' ? +questionSelected.order - 1 : +questionSelected.order + 1

      let questionForChangeOrder = await tbl_question_helpdesks.findOne({ where: { sub_topics_id: +req.body.sub_topics_id, order: newOrder } })

      if (questionForChangeOrder) {
        await tbl_question_helpdesks.update({ order: newOrder }, { where: { id: req.params.id } })
        await tbl_question_helpdesks.update({ order: oldOrder }, { where: { id: questionForChangeOrder.id } })
      }

      res.setHeader('Cache-Control', 'no-cache');
      res.status(200).json({ message: 'Success' })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/helpdesk/sub-topics/${req.params.id}`,
        method: 'put',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err });
      console.log(err)
    }
  }
}

module.exports = helpdesk
