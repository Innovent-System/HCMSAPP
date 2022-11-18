import { commandToRegExp } from "../../util/common";

export const routeCommand = (routes = [], navigate) => {
    const command = routes?.map(r => ({
        formId: r.formId,
        speak: `Going to ${r.title}`,
        matchText: [commandToRegExp(`go to ${r.path.substring(6).replace("/", " ")}.`)],
        onMatch: () => navigate(`${r.path.substring(5).toLowerCase()}/${r._id}`)
    }))

    for (let index = 0; index < command.length; index++) {
        const element = command[index];
        if (element.formId === 2) {
            element.matchText.push(commandToRegExp(`go to employee.`));
            element.matchText.push(commandToRegExp(`go to imply.`));
            element.matchText.push(commandToRegExp(`go to employ.`));
            element.matchText.push(commandToRegExp(`go to imply list.`));
            element.matchText.push(commandToRegExp(`go to employ list.`));
        } else if (element.formId === 4) {
            element.matchText.push(commandToRegExp(`go to profile request.`));
            element.matchText.push(commandToRegExp(`go to profile.`));
            element.matchText.push(commandToRegExp(`go to employee profile.`));
            element.matchText.push(commandToRegExp(`go to employ profile.`));
            element.matchText.push(commandToRegExp(`go to imply profile.`));
        }
        else if (element.formId === 7)//employee apporval 
        {
            element.matchText.push(commandToRegExp(`go to imploy approval.`));
            element.matchText.push(commandToRegExp(`go to employ approval.`));
        }
        else if (element.formId === 8) {
            element.matchText.push(commandToRegExp(`go to employee setting.`));
            element.matchText.push(commandToRegExp(`go to imploy setting.`));
            element.matchText.push(commandToRegExp(`go to employ setting.`));
            element.matchText.push(commandToRegExp(`go to imply setting.`));
        }
        else if (element.formId === 10) {
            element.matchText.push(commandToRegExp(`go to manage company.`));
        }
        else if (element.formId === 11) {
            element.matchText.push(commandToRegExp(`go to organization setting.`));
        }
        else if (element.formId === 12) {
            element.matchText.push(commandToRegExp(`go to attendance.`));
        }
        else if (element.formId === 13) {
            element.matchText.push(commandToRegExp(`go to exemption.`));
        }
        else if(element.formId === 16){
            element.matchText.push(commandToRegExp(`go to attendance setting.`));
        }

        

    }

    return command;
}