package com.c24tipping.entity

import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.MappedSuperclass
import java.lang.RuntimeException
import java.lang.StringBuilder

/**
 * Abstract entity that provides general information to all
 */
@MappedSuperclass
abstract class AbstractEntity {

    /**
     * ID of the entity
     */
    @Id
    @GeneratedValue
    open var id: Long? = null;

    companion object {
        public fun buildJSON(obj: Any, exclude: List<String> = listOf()): String {
            val fields = obj.javaClass.declaredFields;
            val withExcluded = fields.map { it.name }.filter { !exclude.contains(it) && !it.startsWith("$$") };
            val wantedFields = fields.filter { withExcluded.contains(it.name) };
            val builder = StringBuilder();
            builder.append("{");
            for (i in 0..wantedFields.lastIndex) {
                wantedFields[i].isAccessible = true;
                builder.append("\"${wantedFields[i].name}\":");
                if (wantedFields[i].type.toString().equals("class java.lang.String")) {
                    builder.append("\"${wantedFields[i].get(obj).toString()}\"");
                } else {
                    builder.append(wantedFields[i].get(obj).toString());
                }
                if (i < wantedFields.lastIndex) {
                    builder.append(",");
                }
            }
            builder.append("}");
            return builder.toString();
        }
    }
}