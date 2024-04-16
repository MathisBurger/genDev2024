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
        public fun buildJSON(obj: Any, exclude: List<String> = listOf(), id: Long? = null): String {
            val fields = obj.javaClass.declaredFields;
            val withExcluded = fields.map { it.name }.filter { !exclude.contains(it) && !it.startsWith("$$") };
            val wantedFields = fields.filter { withExcluded.contains(it.name) };
            val builder = StringBuilder();
            builder.append("{");
            if (id != null) {
                builder.append("\"id\": $id");
                if (wantedFields.isNotEmpty()) {
                    builder.append(",")
                }
            }
            for (i in 0..wantedFields.lastIndex) {
                try {
                    wantedFields[i].isAccessible = true;
                    val value = wantedFields[i].get(obj).toString();
                    builder.append("\"${wantedFields[i].name}\":");
                    if (wantedFields[i].type.toString().equals("class java.lang.String") || wantedFields[i].type.toString().equals("class java.util.Date")) {
                        builder.append("\"${value}\"");
                    } else {
                        builder.append(value);
                    }
                    if (i < wantedFields.lastIndex) {
                        builder.append(",");
                    }
                } catch (_: Throwable) {

                }
            }
            builder.append("}");
            return builder.toString();
        }
    }
}