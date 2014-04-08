package com.my.load.data;

import java.util.StringTokenizer;

public class DefaultColumn extends Column implements LoadDataConstanse
{
    private String defaultDate="05-MAR-12";
    private String defaultTimestamp="05-MAR-12 12.00.00.000000000 AM";

    
    public DefaultColumn(String columnMame, String columnType, int columnSize, String assistantValue)
    {
	super(columnMame, columnType, columnSize, assistantValue);
    }

    @Override
    public String getDefaultValue()
    {
	String value = null;

	if (getColumnType().equals(LoadDataConstanse.COLUMN_TYPE_DATE))
	{
	    // value = (new SimpleDateFormat("dd-MM-yyyy")).format(new Date());
	    if (getValueMap().get(LOAD_ASSISTANT_DATE) != null)
	    {
		value = getValueMap().get(LOAD_ASSISTANT_DATE);
	    }
	    else
	    {
		value = defaultDate;
	    }

	}
	else if (getColumnType().contains(LoadDataConstanse.COLUMN_TYPE_TIMESTAMP))
	{
	    if (getValueMap().get(LOAD_ASSISTANT_TIMESTAMP) != null)
	    {
		value = getValueMap().get(LOAD_ASSISTANT_TIMESTAMP);
	    }
	    else
	    {
		value = defaultTimestamp;
	    }
	}
	else if (getColumnType().contains(LoadDataConstanse.COLUMN_TYPE_NUM)||getColumnType().equals(LoadDataConstanse.COLUMN_TYPE_BIGING))
	{
	    try
	    {
		value = String.valueOf(Integer.parseInt(getAssistantValue()));
		if (value.length() > getColumnSize())
		{
		    value = String.valueOf(Math.round(Math.random() * getColumnSize()));
		}
	    }
	    catch (NumberFormatException e)
	    {
		value = "0";
	    }
	}
	else
	{
	    value = executeColumnName(getColumnMame(), getColumnSize(), getAssistantValue());
	}
	return value;

    }

    public static String executeColumnName(String columnName, int columnSize, String assistantValue)
    {

	if (assistantValue == null)
	{
	    assistantValue = "";
	}
	else
	{
	    assistantValue = assistantValue.trim();
	}

	StringTokenizer st = new StringTokenizer(columnName, "_");
	StringBuilder stringBuilder = new StringBuilder();
	while (st.hasMoreTokens())
	{
	    try
	    {
		String token = st.nextToken();
		stringBuilder.append(token.trim().charAt(0));
	    }
	    catch (Exception e)
	    {
		throw new RuntimeException("EXECUTE ERROR");
	    }
	}

	// 场合一：columnName宿写的长度和大于列所允许的最大长度的场合
	String checkStr = getValueBySize(stringBuilder.toString(), columnSize, assistantValue);
	if (!checkStr.equals(stringBuilder.toString()))
	{
	    return checkStr;
	}

	if (assistantValue.length() > 0)
	{
	    stringBuilder.append("_").append(assistantValue.trim());
	}

	// 场合二：columnName宿写的长度和小于于列所允许的最大长度的场合
	checkStr = getValueBySize(stringBuilder.toString(), columnSize, assistantValue);
	if (!checkStr.equals(stringBuilder.toString()))
	{
	    return checkStr;
	}

	return stringBuilder.toString();
    }

    public static String getValueBySize(String value, int size, String assistantValue)
    {
	if (value.toString().length() > size)
	{
	    if (assistantValue.length() < size)
	    {
		return assistantValue;
	    }
	    else
	    {
		return String.valueOf(Math.round(Math.random() * size));
	    }
	}
	return value;
    }

    public String getDefaultDate()
    {
        return defaultDate;
    }

    public void setDefaultDate(String defaultDate)
    {
        this.defaultDate = defaultDate;
    }

    public String getDefaultTimestamp()
    {
        return defaultTimestamp;
    }

    public void setDefaultTimestamp(String defaultTimestamp)
    {
        this.defaultTimestamp = defaultTimestamp;
    }

}
