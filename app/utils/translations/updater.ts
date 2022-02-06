import * as fs from 'fs';
import * as path from 'path';

const loadDump = (filePath: string) => JSON.parse(fs.readFileSync(filePath).toString());

const getFilesList = (filesDir: string) =>
{
	const filesList = fs.readdirSync(filesDir).map((v) => filesDir+v);

	return filesList.filter((file) =>
	{
		return (
			path.extname(file) === '.json' &&
			!fs.statSync(file).isDirectory()
		);

	});
};

const removeOrphanedLabels = (filesList: string[], codeIntlEntries: object) =>
{
	filesList.forEach((filePath: string) =>
	{
		const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

		console.log(path.basename(filePath)); // eslint-disable-line no-console
		console.log('---------------------'); // eslint-disable-line no-console

		for (const [ fileContentKey, fileContentVal ] of Object.entries(fileContent))
		{
			if (! Object.hasOwnProperty.call(codeIntlEntries, fileContentKey))
			{
					console.log(` - '${fileContentKey}' ${fileContentVal}`); // eslint-disable-line
				// delete fileContent[fileContentKey];
			}

		}
		// fs.writeFileSync(
		// filePath, 
		// JSON.stringify(fileContent, null, '\t')
		// );
	});
};

const addMissingLabels = (filesList: string[], codeIntlEntries: object) =>
{
	filesList.forEach((filePath) =>
	{
		const fileName = path.basename(filePath);

		console.log(`${fileName} ---------------------`); // eslint-disable-line no-console

		const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

		for (
			const [ codeIntlEntriesKey, codeIntlEntriesVal ] of Object.entries(codeIntlEntries)
		)
		{
			if (! Object.hasOwnProperty.call(fileContent, codeIntlEntriesKey))
			{
				console.log(` + '${codeIntlEntriesKey}': ${codeIntlEntriesVal.defaultMessage}`); // eslint-disable-line

				if (fileName === 'en.json')
					fileContent[codeIntlEntriesKey] = codeIntlEntriesVal.defaultMessage;
				else
					fileContent[codeIntlEntriesKey] = null;
			}
		}

	// sort 
	const fileContentOrdered : object = 
		Object.keys(fileContent).sort().reduce( (obj :any, key: string) => { 

			obj[key] = fileContent[key]; 

			return obj;
		  }, {}
	);

		fs.writeFileSync(filePath, JSON.stringify(fileContentOrdered, null, '    '));
	});

};

const main = () =>
{
	const dumpFile='./utils/translations/tmp/dump.json';
	const translationsDir='./src/intl/translations/';
	const dumpFileObj = loadDump(dumpFile);
	const filesList = getFilesList(translationsDir);

	console.clear(); // eslint-disable-line no-console 
	console.log(`Parsed codeIntlEntries: ${Object.keys(dumpFileObj).length}`); // eslint-disable-line no-console
	console.log(`Parsed files: ${filesList.length}`); // eslint-disable-line no-console
	console.log('-----------------------------------'); // eslint-disable-line no-console
	console.log(''); // eslint-disable-line no-console

	// removeOrphanedLabels(filesList, dumpFileObj);

	addMissingLabels(filesList, dumpFileObj);
};

main();
