package com.my.load.data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class LoadDataFlagDO
{

    private boolean isUK = false;

    private Map<String, Map<String, String>> resultMap = new HashMap<String, Map<String, String>>();

    private List<ForeignKey> foreignKeyList = new ArrayList<ForeignKey>();

    private List<String> orderList = new ArrayList<String>();

    public Map<String, Map<String, String>> getResultMap()
    {
	return resultMap;
    }

    public void setResultMap(Map<String, Map<String, String>> resultMap)
    {
	this.resultMap = resultMap;
    }

    public boolean isUK()
    {
	return isUK;
    }

    public void setUK(boolean isUK)
    {
	this.isUK = isUK;
    }

    public List<ForeignKey> getForeignKeyList()
    {
	return foreignKeyList;
    }

    public void setForeignKeyList(List<ForeignKey> foreignKeyList)
    {
	this.foreignKeyList = foreignKeyList;
    }

    public List<String> getOrderList()
    {
        return orderList;
    }

    public void setOrderList(List<String> orderList)
    {
        this.orderList = orderList;
    }

}
