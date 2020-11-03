const { tbl_departments, tbl_structure_departments, tbl_positions, tbl_department_positions, tbl_department_teams, tbl_team_positions, tbl_companys, tbl_users } = require('../models')
const logError = require('../helpers/logError')

class department {
  static async create(req, res) {
    try {
      let newStructureDepartment = {
        hierarchy: req.body.levelHirarki,
        company_id: req.body.companyId
      }

      if (typeof (req.body.nameDepartment) !== 'number') {
        let createDepartment1 = await tbl_departments.create({ deptname: req.body.nameDepartment })
        newStructureDepartment.departments_id = createDepartment1.id || createDepartment1.null
      } else {
        newStructureDepartment.departments_id = req.body.nameDepartment
      }

      if (typeof (req.body.partOfDepartment) !== 'number') {
        let createDepartment2 = await tbl_departments.create({ deptname: req.body.partOfDepartment })
        newStructureDepartment.department_section = createDepartment2.id || createDepartment2.null
      } else {
        newStructureDepartment.department_section = req.body.partOfDepartment
      }

      let createStructure = await tbl_structure_departments.create(newStructureDepartment)

      for (let i = 0; i < req.body.position.length; i++) {
        let newData = { structure_department_id: createStructure.id, user_id: req.body.position[i].user || null }

        if (typeof (req.body.position[i].position) !== 'number') {
          let createPosition = await tbl_positions.create({ position: req.body.position[i].position })
          newData.position_id = createPosition.id || createPosition.null
        } else {
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

          if (typeof (element) !== 'number') {
            let createPosition = await tbl_positions.create({ position: element })
            newData.position_id = createPosition.id || createPosition.null
          } else {
            newData.position_id = element
          }
          await tbl_team_positions.create(newData)
        });
      })

      res.status(201).json({ message: 'Success' })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Error', err })
    }
  }

  static async findAll(req, res) {
    try {
      let data = await tbl_structure_departments.findAll({
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
      res.status(200).json({ message: 'Success', data })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Error', err })
    }
  }

  static async update(req, res) {
    try {
      let newStructureDepartment = {
        hierarchy: req.body.levelHirarki,
        company_id: req.body.companyId
      }

      if (typeof (req.body.nameDepartment) !== 'number') {
        let createDepartment1 = await tbl_departments.create({ deptname: req.body.nameDepartment })
        newStructureDepartment.departments_id = createDepartment1.id || createDepartment1.null
      } else {
        newStructureDepartment.departments_id = req.body.nameDepartment
      }

      if (typeof (req.body.partOfDepartment) !== 'number') {
        let createDepartment2 = await tbl_departments.create({ deptname: req.body.partOfDepartment })
        newStructureDepartment.department_section = createDepartment2.id || createDepartment2.null
      } else {
        newStructureDepartment.department_section = req.body.partOfDepartment
      }

      await tbl_structure_departments.update(newStructureDepartment, { where: { id: req.params.id } })

      await tbl_department_positions.destroy({ where: { structure_department_id: req.params.id } })
      for (let i = 0; i < req.body.position.length; i++) {
        let newData = { structure_department_id: req.params.id, user_id: req.body.position[i].user  || null}

        if (typeof (req.body.position[i].position) !== 'number') {
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
          let newData = { department_team_id: createTeam.id, user_id: team.user[index] || null}

          if (typeof (element) !== 'number') {
            let createPosition = await tbl_positions.create({ position: element })
            newData.position_id = createPosition.id || createPosition.null
          } else {
            newData.position_id = element
          }
          await tbl_team_positions.create(newData)
        })
      })

      res.status(201).json({ message: 'Success' })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Error', err })
    }
  }

  static async delete(req, res) {
    try {
      await tbl_structure_departments.destroy({ where: { id: req.params.id } })
      await tbl_department_positions.destroy({ where: { structure_department_id: req.params.id } })
      await tbl_department_teams.destroy({ where: { structure_department_id: req.params.id } })
      res.status(200).json({ message: 'Success', id_deleted: req.params.id })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Error', err })
    }
  }
}

module.exports = department
