const Flash = require('../utility/Flash')

exports.dashboardGetController = (req, res, next) => {
    res.render('pages/dashboard/dashboard', 
        {
            title: 'My Dashboard',
            flashMessage: Flash.getMessage(req)
        }
    )
}