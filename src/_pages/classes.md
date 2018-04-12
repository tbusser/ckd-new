---
layout: page
menuOrder: 2
permalink: /classes/
title: Classes
---
# Available classes
{% for class in site.classes %}
<article>
    <h2 id="{{ class.url }}">{{ class.title }} {% if class.ages %}({{ class.ages }}){% endif %}</h2>
    {{ class.content}}

    {% assign firstClass = class.schedule.first %}

    <dl>
    <dt class="u-visuallyHidden">
        When
    </dt>
    <dd class="c-iconText">
        <svg aria-hidden="true" class="o-icon o-icon__clock mr" style="width: 1em"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-clock-o"></use></svg>
        {{ firstClass.day }}{% if firstClass.start %} from {{ firstClass.start }} {% endif %}{% if firstClass.end %} till {{ firstClass.end }}{% endif %}.
    </dd>
    {% if firstClass.location %}
    <dt class="u-visuallyHidden">Where</dt>
    <dd class="c-iconText">
        <svg aria-hidden="true" class="o-icon o-icon__mapMarker mr"  style="width: 1em"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-map-marker"></use></svg>
        {{ firstClass.location }}.
    </dd>
    {% endif %}
    </dl>

    {% if class.schedule.size > 1 %}
    In addition we're also offering classes on the following day(s):
    <dl>
        {% for schedule in class.schedule offset:1 %}
        <dt class="u-visuallyHidden">When</dt>
        <dd class="c-iconText">
            <svg aria-hidden="true" class="o-icon o-icon__clock mr" style="width: 1em"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-clock-o"></use></svg>
            {{ schedule.day }}{% if schedule.start %} from {{ schedule.start }} {% endif %}{% if schedule.end %} till {{ schedule.end }}{% endif %}.
        </dd>
        {% if schedule.location %}
            <dt class="u-visuallyHidden">Where</dt>
            <dd class="c-iconText">
                <svg aria-hidden="true" class="o-icon o-icon__mapMarker mr"  style="width: 1em"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-map-marker"></use></svg>
                {{ schedule.location }}.
            </dd>
        {% endif %}
        {% endfor %}
    </dl>
    {% endif %}
</article>
{% endfor %}

<div class="c-ctaText mt">
    Phone now on <span style="white-space:nowrap;">01634–316027</span>
</div>
