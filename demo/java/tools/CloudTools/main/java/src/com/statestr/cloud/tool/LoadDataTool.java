package com.statestr.cloud.tool;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import com.statestr.cloud.constant.Constant;
import com.statestr.cloud.pojo.Column;
import com.statestr.cloud.pojo.DefaultColumn;
import com.statestr.cloud.pojo.FlagDO;
import com.statestr.cloud.pojo.ForeignKey;

public class LoadDataTool
{
    private static Connection con = null;

    private Map<String, String> valueMap = new HashMap<String, String>();

    public void init(Properties pros)
    {
	getValueMap().put(Constant.LOAD_ASSISTANT_DATE, pros.getProperty(Constant.LOAD_ASSISTANT_DATE));
	getValueMap().put(Constant.LOAD_ASSISTANT_TIMESTAMP, pros.getProperty(Constant.LOAD_ASSISTANT_TIMESTAMP));
    }

    /**
     * 默认取得数据源方式，从datasource.properties取的数据库连接。
     */
    public static Connection getConnection()
    {
	if (con == null)
	{
	    try
	    {
		Properties pros = new java.util.Properties();
		pros.load(new java.io.FileInputStream(new File("datasource.properties")));
		String driver = (String) pros.get("db.driver");
		String url = (String) pros.get("db.url");
		String userName = (String) pros.get("db.username");
		String pwd = (String) pros.get("db.password");
		Class.forName(driver);
		con = DriverManager.getConnection(url, userName, pwd);
	    }
	    catch (Exception ex)
	    {
		ex.printStackTrace();
	    }
	}
	return con;
    }

    public static Properties loadPropertes() throws Exception
    {
	Properties pros = new java.util.Properties();
	pros.load(new java.io.FileInputStream(new File("load.properties")));
	return pros;
    }

    public void createData(DatabaseMetaData databaseMetaData, String schema, String tableName, String assistantValue, FlagDO flagDO)
	    throws Exception
    {

	ResultSet columnSet = databaseMetaData.getColumns(null, schema, tableName, null);
	Map<String, String> map = new HashMap<String, String>();
	while (columnSet.next())
	{
	    Column column = new DefaultColumn(columnSet.getString("COLUMN_NAME"), columnSet.getString("TYPE_NAME"),
		    columnSet.getInt("COLUMN_SIZE"), assistantValue);
	    column.setValueMap(getValueMap());
	    map.put(columnSet.getString("COLUMN_NAME"), column.getDefaultValue());
	}
	flagDO.getResultMap().put(tableName, map);
	columnSet.close();
    }

    public static void parseUKTables(Connection conn, String schema, String tableName, FlagDO flagDO) throws SQLException
    {
	ResultSet rs = conn.getMetaData().getImportedKeys("", schema.toLowerCase(), tableName);
	if (!flagDO.getOrderList().contains(tableName))
	    flagDO.getOrderList().add(tableName);
	while (rs.next())
	{
	    flagDO.getForeignKeyList().add(
		    new ForeignKey(rs.getString("FKCOLUMN_NAME"), tableName, rs.getString("PKCOLUMN_NAME"), rs
			    .getString("PKTABLE_NAME")));
	    parseUKTables(conn, schema, rs.getString("PKTABLE_NAME"), flagDO);

	}
    }

    public void createSQL(String tablelist, Properties pros, Connection conn) throws Exception
    {

	String schema = pros.getProperty(Constant.LOAD_ASSISTANT_SCHEMA).toUpperCase();
	int size = Integer.valueOf(pros.getProperty(Constant.LOAD_ASSISTANT_SIZE));
	int begin = Integer.valueOf(pros.getProperty(Constant.LOAD_ASSISTANT_BEGIN));
	int increament = Integer.valueOf(pros.getProperty(Constant.LOAD_ASSISTANT_INCREATMENT));

	String xmlLine = null;
	BufferedReader xmlReader = new BufferedReader(new FileReader(tablelist));
	BufferedWriter bufferWriter = null;

	File file = new File(tablelist);

	boolean isCreate = Boolean.valueOf(pros.getProperty(Constant.LOAD_CREATE_SQL));
	if (isCreate)
	{
	    String sqlFolder = file.getAbsolutePath().replace(file.getName(), "") + File.separator + "sql" + File.separator;
	    while ((xmlLine = xmlReader.readLine()) != null)
	    {
		String tableName = xmlLine.trim().toUpperCase();
		bufferWriter = new BufferedWriter(new FileWriter(sqlFolder + tableName + ".sql"));
		try
		{
		    FlagDO flagDO = new FlagDO();
		    parseUKTables(conn, schema, tableName, flagDO);
		    DatabaseMetaData databaseMetaData = conn.getMetaData();

		    createData(databaseMetaData, schema, tableName, String.valueOf(begin), flagDO);
		    Set<String> set = new HashSet<String>();
		    for (String table : flagDO.getOrderList())
		    {
			if (!set.contains(table))
			{
			    set.add(table);
			    createData(databaseMetaData, schema, table, String.valueOf(begin), flagDO);
			}
		    }
		    for (ForeignKey foreignKey : flagDO.getForeignKeyList())
		    {
			flagDO.getResultMap()
				.get(foreignKey.getParentTable())
				.put(foreignKey.getParentColumn(),
					flagDO.getResultMap().get(foreignKey.getChildTable()).get(foreignKey.getChildColumn()));
		    }
		    Object[] array = flagDO.getOrderList().toArray();
		    for (int i = 0; i < size; i++)
		    {
			for (int j = 0; j < array.length; j++)
			{
			    String orderTable = flagDO.getOrderList().get(array.length - j - 1);
			    Map<String, String> map = flagDO.getResultMap().get(orderTable);
			    for (String str : map.keySet())
			    {
				map.put(str,
					map.get(str).replace(String.valueOf(begin + (i - 1) * increament),
						String.valueOf(begin + i * increament)));
			    }
			    writeSQL(map, bufferWriter, orderTable);
			}
		    }
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		}
		finally
		{
		    if (bufferWriter != null)
			bufferWriter.close();
		}
		System.out.println(xmlLine + " sql success");
	    }
	}
	isCreate = Boolean.valueOf(pros.getProperty(Constant.LOAD_CREATE_XML));

    }

    public void createXml(String tablelist, Properties pros, Connection conn) throws Exception
    {

	String schema = pros.getProperty(Constant.LOAD_ASSISTANT_SCHEMA).toUpperCase();
	int size = Integer.valueOf(pros.getProperty(Constant.LOAD_ASSISTANT_SIZE));
	int begin = Integer.valueOf(pros.getProperty(Constant.LOAD_ASSISTANT_BEGIN));
	int increament = Integer.valueOf(pros.getProperty(Constant.LOAD_ASSISTANT_INCREATMENT));

	String xmlLine = null;
	BufferedReader xmlReader = new BufferedReader(new FileReader(tablelist));
	BufferedWriter bufferWriter = null;

	File file = new File(tablelist);
	while ((xmlLine = xmlReader.readLine()) != null)
	{
	    String tableName = xmlLine.trim().toUpperCase();
	    String sqlFolder = file.getAbsolutePath().replace(file.getName(), "") + File.separator + "xml" + File.separator;
	    bufferWriter = new BufferedWriter(new FileWriter(sqlFolder + tableName + ".xml"));
	    try
	    {
		FlagDO flagDO = new FlagDO();
		parseUKTables(conn, schema, tableName, flagDO);
		DatabaseMetaData databaseMetaData = conn.getMetaData();
		for (int i = 0; i < size; i++)
		{
		    createData(databaseMetaData, schema, tableName, String.valueOf(begin + i * increament), flagDO);
		    Set<String> set = new HashSet<String>();
		    for (String table : flagDO.getOrderList())
		    {
			if (!set.contains(table))
			{
			    set.add(table);
			    createData(databaseMetaData, schema, table, String.valueOf(begin + i * increament), flagDO);
			}
		    }
		    for (ForeignKey foreignKey : flagDO.getForeignKeyList())
		    {
			flagDO.getResultMap()
				.get(foreignKey.getParentTable())
				.put(foreignKey.getParentColumn(),
					flagDO.getResultMap().get(foreignKey.getChildTable()).get(foreignKey.getChildColumn()));
		    }
		    Object[] array = flagDO.getOrderList().toArray();
		    for (int j = 0; j < array.length; j++)
		    {
			StringBuffer buffer = new StringBuffer("<").append(flagDO.getOrderList().get(array.length - j - 1)).append(
				" ");
			bufferWriter.write(buffer.toString());
			bufferWriter.flush();
			String orderTable = flagDO.getOrderList().get(array.length - j - 1);
			Map<String, String> map = flagDO.getResultMap().get(orderTable);
			for (String key : map.keySet())
			{
			    bufferWriter.write(key + "=" + "\"" + map.get(key) + "\"" + " ");
			}
			bufferWriter.write("/>");
			bufferWriter.newLine();
			bufferWriter.flush();
		    }

		}
		System.out.println(tableName + " success!");
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	    finally
	    {
		if (bufferWriter != null)
		    bufferWriter.close();
	    }
	}

    }

    public static void writeSQL(Map<String, String> map, BufferedWriter bufferWriter, String tableName) throws IOException
    {

	StringBuilder beforeBuffer = new StringBuilder("Insert into ").append(tableName + " ( ");
	StringBuilder afterBuffer = new StringBuilder(" ( ");

	Object[] array = map.keySet().toArray();
	for (int j = 0; j < array.length; j++)
	{
	    if (j == array.length - 1)
	    {
		beforeBuffer.append(array[j]).append(") values");
		afterBuffer.append("'").append(map.get(array[j])).append("' )");
	    }
	    else
	    {
		beforeBuffer.append(array[j]).append(",");
		afterBuffer.append("'").append(map.get(array[j])).append("' , ");
	    }

	}
	beforeBuffer.append(afterBuffer);
	bufferWriter.write(beforeBuffer.toString());
	bufferWriter.newLine();
	bufferWriter.flush();
    }

    public static void executeSQL(Connection conn, String tablelist) throws Exception
    {
	File file = new File(tablelist);
	String sqlFolder = file.getAbsolutePath().replace(file.getName(), "") + File.separator + "sql" + File.separator;
	List<String> list = getCurrentfolder(sqlFolder);
	Statement statement = conn.createStatement();
	for (String sqlFile : list)
	{
	    try
	    {
		if (sqlFile.contains("sql"))
		{
		    BufferedReader sqlReader = new BufferedReader(new FileReader(sqlFile));
		    String sqlLine = null;
		    try
		    {
			while ((sqlLine = sqlReader.readLine()) != null)
			{
			    statement.execute(sqlLine.trim());
			}
			System.out.println(sqlFile + "  execute SQL success !");
		    }
		    catch (Exception e)
		    {
			System.out.println(sqlFile + "  execute SQL fail !");
			e.printStackTrace();
		    }

		}
	    }
	    catch (Exception e)
	    {
		System.out.println(sqlFile + "  execute SQL fail !");
		e.printStackTrace();
	    }
	}
    }

    public static List<String> getCurrentfolder(String folderName)
    {
	List<String> fileList = new ArrayList<String>();
	File file = new File(folderName);
	if (file.exists())
	{
	    if (file.isFile())
	    {
		fileList.add(file.getAbsolutePath());
	    }
	    else if (file.isDirectory())
	    {
		String[] list = file.list();
		int fileNum = file.list().length;
		for (int i = 0; i < fileNum; i++)
		{
		    String separator = System.getProperty("file.separator");
		    File tempFile = new File(file.getAbsolutePath() + separator + list[i]);
		    if (tempFile.isFile())
		    {
			fileList.add(file.getAbsolutePath() + separator + list[i]);
		    }
		}
	    }
	}
	return fileList;
    }

    public Map<String, String> getValueMap()
    {
	return valueMap;
    }

    public void setValueMap(Map<String, String> valueMap)
    {
	this.valueMap = valueMap;
    }

    public static void main(String[] args)
    {
	try
	{
	    System.out.println("********* begin ***********");
	    Properties pros = LoadDataTool.loadPropertes();
	    Connection conn = LoadDataTool.getConnection();
	    LoadDataTool service = new LoadDataTool();
	    service.init(pros);
	    boolean isCreate = Boolean.valueOf(pros.getProperty(Constant.LOAD_CREATE_SQL));
	    if (isCreate)
	    {
		service.createSQL("tablelist.txt", pros, conn);
	    }
	    isCreate = Boolean.valueOf(pros.getProperty(Constant.LOAD_CREATE_XML));
	    if (true)
	    {
		service.createXml("tablelist.txt", pros, conn);
	    }
	    // LoadDataService.executeSQL(conn, "tablelist.xml");
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	System.out.println("*********** end ***********");
    }
}
