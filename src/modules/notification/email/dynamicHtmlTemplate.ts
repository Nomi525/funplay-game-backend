import * as fs from 'fs';
import handlebars from 'handlebars';

export async function generateDynamicHtml(path, data) {
  try {
    console.log({ data });
    // console.log(data.allocationDetails[0]);
    // console.log(data.allocationDetails[1]);

    // data.map(async (allocationStatus: any) => {
    //   const employeeFirstName = allocationStatus.firstName;
    //   const employeeLastName = allocationStatus.lastName;
    //   const employeeStatus = allocationStatus.status;
    //   const employeeRelievingDate = allocationStatus.relievingDate;
    //   const projectName = allocationStatus.ProjectName;
    //   const allocationStartDate = allocationStatus.allocationStartDate;
    //   const allocationEndDate = allocationStatus.allocationEndDate;
    //   data = {
    //     employeeFirstName,
    //     employeeLastName,
    //     employeeStatus,
    //     employeeRelievingDate,
    //     projectName,
    //     allocationStartDate,
    //     allocationEndDate,
    //   };

    if (path) {
      const html_format = await fs.readFileSync(path, 'utf8');
      console.log({ html_format });

      const template = handlebars.compile(html_format);
      handlebars.registerHelper('inc', (value: any) => {
        return parseInt(value) + 1;
      });
      return template(data);
    }
    // });
  } catch (error) {
    console.log(error);
    return error.message;
  }
}
