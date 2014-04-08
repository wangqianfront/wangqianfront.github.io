package com.my.load.data;

import java.util.HashMap;
import java.util.Map;


public abstract class Column
{

    private Map<String, String> valueMap = new HashMap<String, String>();
    
    
    public Column(String columnMame, String columnType, int columnSize, String assistantValue)
    {
	if (columnMame == null || columnType == null)
	{
	    throw new RuntimeException("columnMame or columnType cound't be null !!! ");
	}
	this.columnMame = columnMame;
	this.columnType = columnType;
	this.columnSize = columnSize;
	this.assistantValue = assistantValue;
    }

    private String columnMame;

    private String columnType;

    private Integer columnSize;

    private String assistantValue;

    public String getColumnMame()
    {
	return columnMame;
    }

    public void setColumnMame(String columnMame)
    {
	this.columnMame = columnMame;
    }

    public String getColumnType()
    {
	return columnType;
    }

    public void setColumnType(String columnType)
    {
	this.columnType = columnType;
    }

    public Integer getColumnSize()
    {
	return columnSize;
    }

    public void setColumnSize(Integer columnSize)
    {
	this.columnSize = columnSize;
    }

    public abstract String getDefaultValue();

    public String getAssistantValue()
    {
	return assistantValue;
    }

    public void setAssistantValue(String assistantValue)
    {
	this.assistantValue = assistantValue;
    }

    public Map<String, String> getValueMap()
    {
        return valueMap;
    }

    public void setValueMap(Map<String, String> valueMap)
    {
        this.valueMap = valueMap;
    }

}
