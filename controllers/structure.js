const { tbl_departments, tbl_structure_departments, tbl_positions, tbl_department_positions, tbl_department_teams, tbl_team_positions, tbl_companys, tbl_dinas, tbl_users, tbl_account_details, tbl_log_structures, tbl_PICs } = require('../models')
const logError = require('../helpers/logError')
const Op = require('sequelize').Op
const { createDateAsUTC } = require('../helpers/convertDate');

class department {
  static async create(req, res) {
    try {
      let deptname
      let newStructureDepartment = {
        hierarchy: req.body.levelHirarki,
        company_id: req.body.companyId,
        createdAt: createDateAsUTC(new Date()),
        updatedAt: createDateAsUTC(new Date())
      }

      if (typeof (req.body.nameDepartment) !== 'number' && req.body.nameDepartment !== '' && req.body.nameDepartment !== 'null' && req.body.nameDepartment !== null && req.body.nameDepartment !== 'undefined') {
        deptname = req.body.nameDepartment
        let createDepartment1 = await tbl_departments.create({ deptname: req.body.nameDepartment })
        newStructureDepartment.departments_id = createDepartment1.id || createDepartment1.null
      } else {
        newStructureDepartment.departments_id = req.body.nameDepartment

        let search = await tbl_departments.findOne({ where: { departments_id: req.body.nameDepartment } })
        deptname = search.deptname
      }

      if (typeof (req.body.partOfDepartment) !== 'number' && req.body.partOfDepartment !== '' && req.body.partOfDepartment !== 'null' && req.body.partOfDepartment !== null && req.body.partOfDepartment !== 'undefined') {
        let createDepartment2 = await tbl_departments.create({ deptname: req.body.partOfDepartment })
        newStructureDepartment.department_section = createDepartment2.id || createDepartment2.null
      } else {
        newStructureDepartment.department_section = req.body.partOfDepartment
      }

      let createStructure = await tbl_structure_departments.create(newStructureDepartment)

      for (let i = 0; i < req.body.position.length; i++) {
        let newData = { structure_department_id: createStructure.id, user_id: req.body.position[i].user || null }
        console.log("1", typeof (req.body.position[i].position), req.body.position[i].position !== '', !req.body.position[i].position)
        if (typeof (req.body.position[i].position) !== 'number' && req.body.position[i].position !== '' && req.body.position[i].position !== 'null' && req.body.position[i].position !== null && req.body.position[i].position !== 'undefined') {
          console.log("2", req.body.position[i].position)
          let createPosition = await tbl_positions.create({ position: req.body.position[i].position })
          newData.position_id = createPosition.id || createPosition.null
        } else {
          console.log("3", req.body.position[i].position)
          newData.position_id = req.body.position[i].position
        }
        await tbl_department_positions.create(newData)
      }

      await req.body.team.forEach(async (team) => {

        let newTeam = {
          name: team.nameTeam,
          structure_department_id: createStructure.id,
          report_to: team.reportTo || 0
        }
        let createTeam = await tbl_department_teams.create(newTeam)
        await team.teamPosition.forEach(async (element, index) => {
          let newData = { department_team_id: createTeam.id, user_id: team.user[index] || null }

          if (typeof (element) !== 'number' && element !== '' && element !== 'null' && element !== null && element !== 'undefined') {
            let createPosition = await tbl_positions.create({ position: element })
            newData.position_id = createPosition.id || createPosition.null
          } else {
            newData.position_id = element
          }
          await tbl_team_positions.create(newData)
        });
      })

      res.status(201).json({ message: 'Success' })

      let company = await tbl_companys.findByPk(req.body.companyId)
      let userDetail = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })
      await tbl_log_structures.create({
        department: deptname,
        company: company.company_name,
        action: "CREATE",
        action_by: req.user.user_id + '-' + userDetail.fullname,
        createdAt: createDateAsUTC(new Date()),
        updatedAt: createDateAsUTC(new Date())
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Error', err })
    }
  }

  static async findAll(req, res) {
    try {
      let condition = {}, query, conditionCompany = {}, conditionSearch = {}

      if (req.query.page) {
        let offset = +req.query.page, limit = +req.query.limit
        if (offset > 0) offset = offset * limit
        query = { offset, limit }
      }
      if (req.query.company) conditionCompany = { company_id: req.query.company }

      if (req.user.user_id !== 1 && !req.query.forOption) {
        let userLogin = await tbl_users.findOne({ where: { user_id: req.user.user_id }, include: [{ as: 'dinas', model: tbl_dinas }, { model: tbl_account_details }] })
        let userPIC = await tbl_PICs.findAll({ where: { user_id: req.user.user_id } })

        let tempCondition = []
        tempCondition.push({ company_id: userLogin.tbl_account_detail.company_id })

        let idCompany = []
        userLogin.dinas.length > 0 && userLogin.dinas.forEach(el => {
          idCompany.push(el.company_id)
          tempCondition.push({
            company_id: el.company_id,
          })
        })
        userPIC && userPIC.forEach(el => {
          if (idCompany.indexOf(el.company_id) === -1) {
            idCompany.push(el.company_id)
            tempCondition.push({
              company_id: el.company_id,
            })
          }
        })

        condition = { [Op.or]: tempCondition }
      }

      let data = await tbl_structure_departments.findAll({
        ...query,
        where: { ...condition, ...conditionCompany },
        include: [
          { model: tbl_companys },
          { as: "department", model: tbl_departments },
          { as: "section", model: tbl_departments },
          {
            model: tbl_department_positions,
            include: [
              { model: tbl_users },
              { model: tbl_positions }
            ]
          },
          {
            model: tbl_department_teams,
            include: [
              { model: tbl_users },
              {
                model: tbl_team_positions,
                include: [
                  { model: tbl_users },
                  { model: tbl_positions }
                ]
              }
            ]
          },
        ]
      })

      let allData = await tbl_structure_departments.findAll({
        where: { ...condition, ...conditionCompany }
      })

      res.status(200).json({ message: 'Success', totalData: allData.length, data })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Error', err })
    }
  }

  static async update(req, res) {
    try {
      let deptname
      let newStructureDepartment = {
        hierarchy: req.body.levelHirarki,
        company_id: req.body.companyId,
        updatedAt: createDateAsUTC(new Date())
      }

      if (typeof (req.body.nameDepartment) !== 'number' && req.body.nameDepartment !== '' && req.body.nameDepartment !== 'null' && req.body.nameDepartment !== null && req.body.nameDepartment !== 'undefined') {
        deptname = req.body.nameDepartment

        let createDepartment1 = await tbl_departments.create({ deptname: req.body.nameDepartment })
        newStructureDepartment.departments_id = createDepartment1.id || createDepartment1.null
      } else {
        newStructureDepartment.departments_id = req.body.nameDepartment

        let search = await tbl_departments.findOne({ where: { departments_id: req.body.nameDepartment } })
        deptname = search.deptname
      }

      if (typeof (req.body.partOfDepartment) !== 'number' && req.body.partOfDepartment !== '' && req.body.partOfDepartment !== 'null' && req.body.partOfDepartment !== null && req.body.partOfDepartment !== 'undefined') {
        let createDepartment2 = await tbl_departments.create({ deptname: req.body.partOfDepartment })
        newStructureDepartment.department_section = createDepartment2.id || createDepartment2.null
      } else {
        newStructureDepartment.department_section = req.body.partOfDepartment
      }

      await tbl_structure_departments.update(newStructureDepartment, { where: { id: req.params.id } })

      await tbl_department_positions.destroy({ where: { structure_department_id: req.params.id } })
      for (let i = 0; i < req.body.position.length; i++) {
        let newData = { structure_department_id: req.params.id, user_id: req.body.position[i].user || null }

        if (typeof (req.body.position[i].position) !== 'number' && req.body.position[i].position !== '' && req.body.position[i].position !== 'null' && req.body.position[i].position !== null && req.body.position[i].position !== 'undefined') {
          let createPosition = await tbl_positions.create({ position: req.body.position[i].position })
          newData.position_id = createPosition.id || createPosition.null
        } else {
          newData.position_id = req.body.position[i].position
        }
        await tbl_department_positions.create(newData)
      }

      await tbl_department_teams.destroy({ where: { structure_department_id: req.params.id } })

      await req.body.team.forEach(async (team) => {
        let newTeam = {
          name: team.nameTeam,
          structure_department_id: req.params.id,
          report_to: team.reportTo || 0
        }
        let createTeam = await tbl_department_teams.create(newTeam)

        await team.teamPosition.forEach(async (element, index) => {
          let newData = { department_team_id: createTeam.id, user_id: team.user[index] || null }

          if (typeof (element) !== 'number' && element !== '' && element !== 'null' && element !== null && element !== 'undefined') {
            let createPosition = await tbl_positions.create({ position: element })
            newData.position_id = createPosition.id || createPosition.null
          } else {
            newData.position_id = element
          }
          await tbl_team_positions.create(newData)
        })
      })

      res.status(201).json({ message: 'Success' })

      let company = await tbl_companys.findByPk(req.body.companyId)
      let userDetail = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })
      await tbl_log_structures.create({
        department: deptname,
        company: company.company_name,
        action: "UPDATE",
        action_by: req.user.user_id + '-' + userDetail.fullname,
        createdAt: createDateAsUTC(new Date()),
        updatedAt: createDateAsUTC(new Date())
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Error', err })
    }
  }

  static async delete(req, res) {
    try {
      let data = await tbl_structure_departments.findOne({
        where: { id: req.params.id }, include: [{ model: tbl_companys }, { as: "department", model: tbl_departments }]
      })

      await tbl_structure_departments.destroy({ where: { id: req.params.id } })
      await tbl_department_positions.destroy({ where: { structure_department_id: req.params.id } })
      await tbl_department_teams.destroy({ where: { structure_department_id: req.params.id } })
      res.status(200).json({ message: 'Success', id_deleted: req.params.id })

      let userDetail = await tbl_account_details.findOne({ where: { user_id: req.user.user_id } })
      await tbl_log_structures.create({
        department: data.department.deptname,
        company: data.tbl_company.company_name,
        action: "DELETE",
        action_by: req.user.user_id + '-' + userDetail.fullname,
        createdAt: createDateAsUTC(new Date()),
        updatedAt: createDateAsUTC(new Date())
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Error', err })
    }
  }

  static async findAllLog(req, res) {
    try {
      let data
      if (req.query.date) {
        let year = new Date(req.query.date).getFullYear()
        let month = new Date(req.query.date).getMonth() + 1, nextMonth = month + 1

        if (month < 10) {
          month = `0${month}`
        }
        if (nextMonth < 10) {
          nextMonth = `0${nextMonth}`
        }

        data = await tbl_log_structures.findAll({
          where: {
            createdAt: {
              [Op.between]: [`${year}-${month}-01 00:00:00`, `${year}-${nextMonth}-01 00:00:00`]
            }
          },
          order: [['createdAt', 'DESC']]
        })
      } else {
        data = await tbl_log_structures.findAll({ order: [['createdAt', 'DESC']] })
      }
      res.status(200).json({ message: "Success", data })
    } catch (err) {
      let error = {
        uri: `http://api.polagroup.co.id/address/log`,
        method: 'delete',
        status: 500,
        message: err,
        user_id: req.user.user_id
      }
      logError(error)
      res.status(500).json({ err })
    }
  }
}

module.exports = department
